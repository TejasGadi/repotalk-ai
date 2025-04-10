import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { generateEmbedding, summarizeCode } from "./openai";
import { Document } from "@langchain/core/documents";
import { db } from "~/server/db";
import { Octokit } from "octokit";

const getFileCount = async(path:string, octokit: Octokit, githubOwner: string, githubRepo: string, acc: number=0)=>{
    const {data} = await octokit.rest.repos.getContent({
        owner: githubOwner,
        repo: githubRepo,
        path
    })

    if(!Array.isArray(data) && data.type == "file"){
        return acc + 1
    }

    if(Array.isArray(data)){
        let fileCount = 0
        const directories : string[] = []
        
        for (const item of data){
            if(item.type === 'dir'){
                directories.push(item.path)
            }
            else{
                fileCount++
            }
        }

        if(directories.length > 0){
            const directoryCounts = await Promise.all(directories.map(dirPath=>
                getFileCount(dirPath, octokit, githubOwner, githubRepo, 0)
            ))

            fileCount += directoryCounts.reduce((acc, count)=> acc! + count!, 0)!
        }
        return acc + fileCount
    }

    return acc
}

export const checkRequiredCredits = async (githubUrl: string, githubToken?:string)=>{
    const default_access_token = process.env.GITHUB_TOKEN
    if(githubToken == null || githubToken ==''){
        githubToken = default_access_token
    }

    // Total number of files in this repository
    const octokit = new Octokit({
        auth:githubToken
    })

    const githubOwner = githubUrl.split('/')[3]
    const githubRepo = githubUrl.split('/')[4]


    if(!githubOwner || !githubRepo){
        return 0
    }

    const fileCount = await getFileCount('', octokit, githubOwner, githubRepo, 0)

    return fileCount
    
}

export const loadGitHubRepo = async(githubUrl: string, githubToken?:string) =>{
    const default_access_token = process.env.GITHUB_TOKEN

    if(githubToken == null || githubToken ==''){
        githubToken = default_access_token
    }
    
    const loader = new GithubRepoLoader(githubUrl, {
        // Default Github Token
        accessToken: githubToken,
        branch: 'main',
        ignoreFiles:['package-lock.json', 'yarn.lock'],
        recursive: true,
        unknown:'warn',
        maxConcurrency: 5
    })

    const docs = await loader.load();
    return docs
}

function removeNullBytes(str: string): string {
    return str.replace(/\x00/g, '');
}

export const indexGithubRepo = async(projectId: string, githubUrl: string, githubToken?: string)=>{
    try {
        
    const docs = await loadGitHubRepo(githubUrl, githubToken)
    // console.log("Loaded docs:", docs.length);

    const allEmbeddings = await generateEmbeddings(docs)

    // console.log("Generated embeddings:", allEmbeddings.filter(Boolean).length);

    // Store to Vector DB
    const results = await Promise.allSettled(allEmbeddings.map(async(embedding, index)=>{
        try {
            console.log(`processing ${index} of ${allEmbeddings.length}`)
            // console.log("Embedding value at index", index, ":", embedding)


            if(!embedding){
                return
            }

            console.log("Creating record for file:", embedding.fileName)

            const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
                data: {
                    summary: embedding.summary,
                    sourceCode: removeNullBytes(embedding.sourceCode),
                    filename: embedding.fileName,
                    projectId
                }
            })

            // console.log("Created record ID:", sourceCodeEmbedding.id)


            // Using Raw Query push vector of summary to the DB
            await db.$executeRaw`
            UPDATE "SourceCodeEmbedding"
            SET "summaryEmbedding" =  ${embedding.embedding}::vector
            WHERE "id" = ${sourceCodeEmbedding.id}
            `
        }catch (err) {
            console.error(`❌ Error while processing index ${index}:`, err);
        }
    }))

    // console.log("All settled results:", results)

    } catch (error) {
        console.error("Error in indexGitHubRepo:", error)
        return null
    }
}

const generateEmbeddings = async (docs: Document[])=>{
    return await Promise.all(docs.map(async(doc)=>{
        // Generate summary for every code file
        const summary = (await summarizeCode(doc)).toString()
        
        // Generate Embeddings
        const embedding = await generateEmbedding(summary)
        return {
            summary,
            embedding,
            sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
            fileName: doc.metadata.source
        }
    }))
}