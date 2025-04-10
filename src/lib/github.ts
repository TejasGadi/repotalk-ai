import {Octokit} from "octokit"
import { db } from "~/server/db"
import axios from "axios"
import { headers } from "next/headers"
import { aiSummarizeCommit } from "./openai"


export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

// const githubUrl = "github.com/docker/genai-stack"

type Response = {
    commitMessage: string
    commitHash: string
    commitAuthorName: string
    commitAuthorAvatar: string
    commitDate: string
}

export const getCommitHashes = async (githubUrl: string): Promise<Response[]>=>{
    const [owner, repo] = githubUrl.split('/').slice(-2)
    if(!owner || !repo){
        throw new Error("Invalid Github URL provided!!")
    }
    const {data} = await octokit.rest.repos.listCommits({
        owner,
        repo
    })

    const sortedCommits = data.sort((a: any, b: any)=>(new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any)

    return sortedCommits.slice(0, 15).map((commit: any)=>({
        commitHash: commit.sha as string,
        commitMessage: commit.commit?.message?? "",
        commitAuthorName:  commit.commit?.author?.name ?? "",
        commitAuthorAvatar: commit?.author?.avatar_url ?? "",
        commitDate: commit.commit?.author?.date ?? ""

    }))
}


export const pollCommits = async(projectId: string) => {
    const {project, githubUrl} = await fetchProjectGithubUrl(projectId)
    const commitHashes = await getCommitHashes(githubUrl)
    const unprocessedCommits = await filterUnprocessedCommits(projectId,commitHashes)
    // console.log("Number of unprocessedCommits", unprocessedCommits.length)
    // console.log("unprocessedCommit 0th", unprocessedCommits[0])

    const summaryResponses = await Promise.allSettled(unprocessedCommits.map((commit)=>{
        return summarizeCommit(githubUrl,commit.commitHash)
    }))

    const summaries = summaryResponses.map((response,i)=>{
        if(response.status=="fulfilled"){
            // console.log("Response value:", response)
            return response.value as string
        }
        if (response.status === "rejected") {
            console.error(`Error summarizing commit ${unprocessedCommits[i]?.commitHash}:`, response.reason)
        }
        return ""
    })

    // Save this commit and summary in the db
    const commits = await db.commit.createMany({
        data: summaries.map((summary, index)=>{
            console.log(`processing commit ${index}`)
            return {
                projectId: projectId,
                commitHash: unprocessedCommits[index]!.commitHash,
                commitMessage: unprocessedCommits[index]!.commitMessage,
                commitAuthorName:  unprocessedCommits[index]!.commitAuthorName,
                commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorName,
                commitDate: unprocessedCommits[index]!.commitDate,
                summary: summary
            }
        })
    })

    return commits
}

const fetchProjectGithubUrl = async(projectId: string)=>{
    const project = await db.project.findUnique({
        where:{id: projectId},
        select:{
            githubUrl: true
        }
    })

    if(!project?.githubUrl){
        throw new Error("Project has no github url")
    }

    return {
        project,
        githubUrl: project?.githubUrl
    }
}

const filterUnprocessedCommits = async (
    projectId: string,
    commitHashes: Response[]
  ) => {
    // Get processed commits from DB
    const processedCommits = await db.commit.findMany({
      where: { projectId: projectId },
      select: { commitHash: true },
    });
  
    const processedHashesSet = new Set(
      processedCommits.map((c) => c.commitHash.toLowerCase())
    );
  
    const unprocessedCommits = commitHashes.filter(
      (commit) => !processedHashesSet.has(commit.commitHash.toLowerCase())
    );
  
    // Debug logs
    // console.log("Total commits fetched from GitHub:", commitHashes.length);
    // console.log("Processed commit hashes in DB:", [...processedHashesSet]);
    // console.log("Unprocessed commits:", unprocessedCommits.map((c) => c.commitHash));
  
    return unprocessedCommits;
  };
  
const summarizeCommit = async (githubUrl: string, commitHash: string)=>{
    // Get the diff, then pass it to summarizeCommit gemini api
    const {data} = await axios.get(`${githubUrl}/commit/${commitHash}.diff`,
        {headers:{
            Accept:'application/vnd.github.v3.diff'
        },
        timeout: 15000 // 15 seconds
    }
    )
    
    return await aiSummarizeCommit(data)
}