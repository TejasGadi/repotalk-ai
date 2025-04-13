import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { generateEmbedding, summarizeCode } from "./openai";
import { Document } from "@langchain/core/documents";
import { db } from "~/server/db";
import { Octokit } from "octokit";
import { pineconeIndex } from "~/lib/pinecone"; // Make sure this is correctly exporting your Pinecone index instance

const getFileCount = async (path: string, octokit: Octokit, githubOwner: string, githubRepo: string, acc: number = 0) => {
  const { data } = await octokit.rest.repos.getContent({
    owner: githubOwner,
    repo: githubRepo,
    path
  });

  if (!Array.isArray(data) && data.type == "file") {
    return acc + 1;
  }

  if (Array.isArray(data)) {
    let fileCount = 0;
    const directories: string[] = [];

    for (const item of data) {
      if (item.type === 'dir') {
        directories.push(item.path);
      } else {
        fileCount++;
      }
    }

    if (directories.length > 0) {
      const directoryCounts = await Promise.all(directories.map(dirPath =>
        getFileCount(dirPath, octokit, githubOwner, githubRepo, 0)
      ));

      fileCount += directoryCounts.reduce((acc, count) => acc! + count!, 0)!;
    }
    return acc + fileCount;
  }

  return acc;
};

export const checkRequiredCredits = async (githubUrl: string, githubToken?: string) => {
  const default_access_token = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    githubToken = default_access_token;
  }

  const octokit = new Octokit({ auth: githubToken });

  const githubOwner = githubUrl.split('/')[3];
  const githubRepo = githubUrl.split('/')[4];

  if (!githubOwner || !githubRepo) {
    return 0;
  }

  const fileCount = await getFileCount('', octokit, githubOwner, githubRepo, 0);
  return fileCount;
};

export const loadGitHubRepo = async (githubUrl: string, githubToken?: string) => {
  const default_access_token = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    githubToken = default_access_token;
  }

  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken,
    branch: 'main',
    ignoreFiles: ['package-lock.json', 'yarn.lock'],
    recursive: true,
    unknown: 'warn',
    maxConcurrency: 5
  });

  const docs = await loader.load();
  return docs;
};

function removeNullBytes(str: string): string {
  return str.replace(/\x00/g, '');
}

export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
  try {
    const docs = await loadGitHubRepo(githubUrl, githubToken);
    const allEmbeddings = await generateEmbeddings(docs);

    const pineconeVectors: {
      id: string;
      values: number[];
      metadata: {
        projectId: string;
        filename: string;
        summary: string;
      };
    }[] = [];

    for (const embedding of allEmbeddings) {
      if (!embedding) continue;

      // Save metadata to Postgres
      const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
        data: {
          summary: embedding.summary,
          sourceCode: removeNullBytes(embedding.sourceCode),
          filename: embedding.fileName,
          projectId,
        },
      });

      // Prepare vector for Pinecone
      pineconeVectors.push({
        id: sourceCodeEmbedding.id,
        values: embedding.embedding,
        metadata: {
          projectId,
          filename: embedding.fileName,
          summary: embedding.summary,
        },
      });
    }

    // Bulk upload to Pinecone
    if (pineconeVectors.length > 0) {
      await pineconeIndex.upsert(pineconeVectors); // ✅ FIXED LINE
      console.log(`✅ Uploaded ${pineconeVectors.length} vectors to Pinecone`);
    }

  } catch (error) {
    console.error("❌ Error in indexGitHubRepo:", error);
    return null;
  }
};

const generateEmbeddings = async (docs: Document[]) => {
  return await Promise.all(docs.map(async (doc) => {
    const summary = (await summarizeCode(doc)).toString();
    const embedding = await generateEmbedding(summary);
    return {
      summary,
      embedding,
      sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
      fileName: doc.metadata.source
    };
  }));
};
