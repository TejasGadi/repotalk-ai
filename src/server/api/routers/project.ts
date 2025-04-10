import { pollCommits } from "~/lib/github";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { checkRequiredCredits, indexGithubRepo } from "~/lib/githubloader";

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure
  .input(
    z.object({
      name: z.string(),
      githubUrl: z.string(),
      githubToken: z.string().optional()
    })
  )
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.user.userId! },
      select: { credits: true },
    });

    if (!user) throw new Error("User not found");
    if (!ctx.user?.userId) throw new Error("Missing user ID");

    const currentCredits = user.credits || 0;
    const fileCount = await checkRequiredCredits(input.githubUrl, input.githubToken);

    if (currentCredits < fileCount) {
      throw new Error("Insufficient Credits!");
    }

    const project = await ctx.db.project.create({
      data: {
        name: input.name,
        githubUrl: input.githubUrl,
        userToProject: {
          create: {
            userId: ctx.user.userId!
          }
        }
      }
    });

    // Call background job API (non-blocking)
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/background-process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project.id,
        githubUrl: input.githubUrl,
        githubToken: input.githubToken,
        userId: ctx.user.userId,
        fileCount,
      })
    }).catch(console.error);

    return project;
  }),

    getProjects: protectedProcedure.query(async({ctx})=>{
        return ctx.db.project.findMany({
            where:{
                userToProject:{
                    some:{
                        userId: ctx.user.userId!
                    }
                },
                deletedAt: null
            }
        })
    }),
    getCommits: protectedProcedure.input(z.object(
        {
            projectId: z.string()
        }
    )).query(async({ctx, input})=>{
        pollCommits(input.projectId).then().catch(console.error)
        return await ctx.db.commit.findMany({where:{
            projectId:input.projectId
        }})
    }),

    saveAnswer:protectedProcedure.input(z.object(
        {
            projectId:z.string(),
            question: z.string(),
            answer: z.string(),
            filesReferences: z.any()

        }
    )).mutation(async ({ctx, input})=>{
        return await ctx.db.question.create({
            data:{
                answer: input.answer,
                filesReferences: input.filesReferences,
                projectId: input.projectId,
                question: input.question,
                userId: ctx.user.userId!
            }
        })
    }),

    getQuestions:protectedProcedure.input(z.object(
        {
            projectId: z.string()
        }
    )).query(async({ctx, input})=>{
        return await ctx.db.question.findMany({
            where:{
                projectId: input.projectId
            },
            include:{
                user: true
            },
            orderBy:{
                createdAt: 'desc'
            }
        })
    }),

    archiveProject : protectedProcedure.input(z.object(
        {
            projectId: z.string()
        }
    )).mutation(async({ctx, input})=>{
        return await ctx.db.project.update({
            where:{
                id:input.projectId 
            },
            data:{
                deletedAt: new Date()
            }
        })
    }),

    getTeamMembers:protectedProcedure.input(z.object(
        {
            projectId: z.string()
        }
    )).query(async({ctx, input})=>{
        return await ctx.db.userToProjectJoin.findMany({
            where:{
                projectId: input.projectId
            },
            include:{
                user: true
            }
        })
    }),
    getMyCredits:protectedProcedure.query(async({ctx})=>{
        return await ctx.db.user.findUnique({
            where:{
                id: ctx.user.userId!
            },
            select:{
                credits: true,
                emailAddress: true,
                id: true
            }
        })
    }),
    checkCredits:protectedProcedure.input(z.object(
        {
            githubUrl: z.string(),
            githubToken: z.string().optional(),
        }
    )).mutation(async({ctx, input})=>{
        const fileCount = await checkRequiredCredits(input.githubUrl, input.githubToken)
        const userCredits = await ctx.db.user.findUnique({
            where:{
                id: ctx.user.userId!
            },
            select:{
                credits: true
            }
        })
        return {
            fileCount,
            userCredits: userCredits?.credits || 0
        }
    }),

})