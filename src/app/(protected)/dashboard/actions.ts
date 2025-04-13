"use server";

import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { createOpenAI } from "@ai-sdk/openai";
import { generateEmbedding } from "~/lib/openai";
import { db } from "~/server/db";
import { pineconeIndex } from "~/lib/pinecone";
// Remove tiktoken import
// import { encoding_for_model } from "@dqbd/tiktoken";

// Import a simpler tokenizer alternative
import { encode } from "gpt-tokenizer";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const MAX_PROMPT_TOKENS = 16000;

export const askQuestion = async (question: string, projectId: string) => {
  const stream = createStreamableValue();

  // 1. Generate embedding
  const queryVector = await generateEmbedding(question);

  // 2. Query Pinecone
  const pineconeResults = await pineconeIndex.query({
    topK: 8,
    vector: queryVector,
    includeMetadata: true,
    filter: {
      projectId: { $eq: projectId }
    }
  });

  console.log("🔍 Pinecone results:", pineconeResults);

  const filesReferenced = pineconeResults.matches?.map((match) => ({
    id: match.id,
    similarity: match.score ?? 0,
    filename: match.metadata?.filename as string,
    summary: match.metadata?.summary as string,
  })) ?? [];

  // 3. Fetch code from DB
  const ids = filesReferenced.map((f) => f.id);
  const codeRecords = await db.sourceCodeEmbedding.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  // 4. Merge source code
  const mergedFiles = filesReferenced.map((file) => {
    const record = codeRecords.find((r) => r.id === file.id);
    return {
      ...file,
      sourceCode: record?.sourceCode ?? "",
    };
  });

  // 5. Build and trim context to stay under token limit using alternative tokenizer
  // No need to instantiate encoder anymore
  let context = "";
  let tokenCount = 0;

  for (const doc of mergedFiles) {
    const codeSnippet = doc.sourceCode.slice(0, 2000); // slice large files
    const contextChunk = `source: ${doc.filename}\ncode content:\n${codeSnippet}\nsummary: ${doc.summary}\n\n`;
    
    // Use the alternative tokenizer
    const chunkTokens = encode(contextChunk).length;

    if (tokenCount + chunkTokens > MAX_PROMPT_TOKENS) {
      console.log("⚠️ Context truncated to stay within token limit.");
      break;
    }

    context += contextChunk;
    tokenCount += chunkTokens;
  }

  // No need to free encoder
  console.log("🧠 Final context token count:", tokenCount);

  // 6. Build prompt
  const prompt = `
    You are an AI code assistant who answers questions about the codebase. Your target audience is a technical intern.
    AI assistant is a brand new, powerful, human-like artificial intelligence.  
    The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.  
    AI is a well-behaved and well-mannered individual.  
    AI is always friendly, kind, and inspiring, and is eager to provide vivid and thoughtful responses to the user.  
    AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic.
    If the question is asking about code or a specific file, AI will provide a detailed answer, giving step-by-step instructions.

    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK
    
    START QUESTION
    ${question}
    END OF QUESTION
    
    The AI assistant will take into account any CONTEXT BLOCK provided in a conversation.  
    If the context does not provide the answer to the question, the AI assistant will say:  
    "I'm sorry, but I don't know the answer to that based on the provided context."
    
    AI assistant will not apologize for previous responses, but will indicate when new information has been gained.  
    AI assistant will not invent anything that is not directly supported by the context.  
    
    Answer in markdown format. Include code snippets where appropriate. Be as detailed and precise as possible when answering.
  `;

  // 7. Stream with timeout
  (async () => {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("LLM stream timeout after 15s")), 15000)
      );

      const result = await Promise.race([
        streamText({ model: openai("gpt-4o-mini"), prompt }),
        timeoutPromise,
      ]) as { textStream: AsyncIterable<string> };
      
      for await (const chunk of result.textStream) {
        stream.update(chunk);
      }

      stream.done();
    } catch (err) {
      console.error("❌ Error in streaming:", err);
      stream.done("⚠️ The AI assistant could not respond due to a timeout or error.");
    }
  })();

  return {
    output: stream.value,
    filesReferenced: mergedFiles,
    context,
  };
};