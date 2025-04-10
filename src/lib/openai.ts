import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// Initialize chat and embedding models
const chatModel = new ChatOpenAI({
  temperature: 0.7,
  modelName: "gpt-4o-mini",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const embeddingModel = new OpenAIEmbeddings({
  modelName: "text-embedding-3-small",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// === COMMIT SUMMARY ===
export const aiSummarizeCommit = async (diff: string) => {
  const prompt = `You are an expert programmer tasked with summarizing a git diff commit.
  ## Understanding the Git Diff Format:

  1. Each file change starts with metadata lines, for example:
  \`\`\`
  diff --git a/lib/index.js b/lib/index.js
  index aadf691..bfef603 100644
  --- a/lib/index.js
  +++ b/lib/index.js
  \`\`\`
  This indicates that \`lib/index.js\` was modified in this commit. Note that this is only an example.

  2. Line modifications are specified as follows:
  - Lines starting with \`+\` were **added**.
  - Lines starting with \`-\` were **removed**.
  - Lines without \`+\` or \`-\` are **context lines** and should not be included in the summary. It is not a part of diff.

  Example Summary Comments:
  \`\`\`
  * Increased the number of returned recordings from 10 to 100 [packages/server/recordings_api.ts, packages/server/constants.ts]
  * Fixed a typo in the GitHub Action name [.github/workflows/gpt-commit-summarizer.yml]
  * Moved \`octokit\` initialization to a separate file [src/octokit.ts, src/index.ts]
  * Added OpenAI API support for completions [packages/utils/apis/openai.ts]
  * Lowered numeric tolerance in test files
  - If a change affects multiple files but relates to the same feature, group them together.
  - If there are more than two relevant files, omit filenames in the last summary item.
  \`\`\`

  Most commits will have less comments than this examples list.
  The last comment does not include the file names,
  because here were more than two relevant files in the hypothetical commit.
  Do not include parts of the example in your summary.
  It is given only as an example of appropriate comments.`;

  const instruction = `Please summarise the following diff file: \n\n${diff}`;

  const response = await chatModel.invoke([
    new SystemMessage(prompt),
    new HumanMessage(instruction),
  ]);

  return response.content;
};

// === CODE SUMMARY ===
export const summarizeCode = async (doc: Document) => {
  try{
    const code = doc.pageContent.slice(0, 10000);

    const prompt = `You are a intelligent software engineer who specializes in onboarding junior software engineers onto projects`;

    const instruction = `You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file. 
    Here is the code:
    ---
    ${code}
    ---
    Give a summary no more than 100 words of the code above
    `;

    const response = await chatModel.invoke([
        new SystemMessage(prompt),
        new HumanMessage(instruction),
    ]);

    return response.content;
  }catch(err){
    console.log(`Error in Summarizing the code. Error: ${err}`)
    return " "
  }
};

// === EMBEDDING GENERATION ===
export const generateEmbedding = async (summary: string) => {
  const embeddings = await embeddingModel.embedQuery(summary);
  return embeddings;
};
