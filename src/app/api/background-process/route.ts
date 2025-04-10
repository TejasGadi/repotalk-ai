
import { pollCommits } from "~/lib/github";
import { indexGithubRepo } from "~/lib/githubloader";
import { db } from "~/server/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, githubUrl, githubToken, userId, fileCount } = body;

    await indexGithubRepo(projectId, githubUrl, githubToken);
    await pollCommits(projectId);

    await db.user.update({
      where: { id: userId },
      data: { credits: { decrement: fileCount } },
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Background job failed", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}