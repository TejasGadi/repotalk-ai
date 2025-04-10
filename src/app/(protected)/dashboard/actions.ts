"use server"

import {streamText} from "ai"
import {createStreamableValue} from "ai/rsc"
import {createOpenAI} from "@ai-sdk/openai"
import { generateEmbedding } from "~/lib/openai"
import { db } from "~/server/db"

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export const askQuestion = async(question: string, projectId: string)=>{
    const stream = createStreamableValue()
    const queryVector = await generateEmbedding(question)
    const vectorQuery = `[${queryVector.join(',')}]`
    

    const fetchedresult = await db.$queryRaw`
    SELECT "filename", "sourceCode", "summary",
            1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.2
        AND "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT 10
    `;

    console.log("result", fetchedresult)

    // Later, cast it when you use it:
    const result = fetchedresult as {
        filename: string;
        sourceCode: string;
        summary: string;
        similarity: number;
    }[];

    let context = "";

    for (const doc of result){
        context += `source ${doc.sourceCode}\n code content : ${doc.sourceCode}\nsummary of the file: ${doc.summary}\n\n`
    }

    (async () => {
        const { textStream } = await streamText({
          model: openai("gpt-4o-mini"),
          prompt: `
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
          `
        });
      
        // Use the stream however you need (for example, reading the response)
        for await (const chunk of textStream) {
          stream.update(chunk);
        }

        stream.done()
      })();

      console.log("context",context)
      
      return {
        output: stream.value,
        filesReferenced: result,
        context
      }
    
}