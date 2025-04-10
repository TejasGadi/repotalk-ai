import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import useProject from "~/hooks/use-project"
import useRefetch from "~/hooks/use-refetch"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"

const CommitLog = () => {
  const { selectedProjectId, project } = useProject();
  const commitBaseUrl = `${project?.githubUrl}/commits`;

  const { data: commits } = api.project.getCommits.useQuery({
    projectId: selectedProjectId,
  });

  const refetch = useRefetch()

  useEffect(()=>{
    if(commits?.length!=0){
      return
    }

    refetch()
  }, [commits])

  return (
    <>
        <h1 className="text-3xl font-bold mb-8 ml-2">Recent Commits</h1>
        {commits?.length!=0 ?
        (
        <ul className="space-y-6 ml-10 relative">
          {commits?.map((commit, commitIdx) => (
            <li key={commit.id} className="relative flex gap-x-4 items-start">
              {/* Timeline Connector */}
              {commitIdx !== commits.length - 1 && (
                <div className="absolute left-4 top-10 h-full w-px bg-gray-200"></div>
              )}

              {/* Avatar */}
              <img
              src={commit.commitAuthorAvatar === null? commit.commitAuthorAvatar :  "default_avatar.png"}
              alt="Commit Author Avatar"
              className="size-8 rounded-full bg-gray-50"
            />

              {/* Commit Message Box */}
              <div className="flex-auto rounded-md bg-white p-3 ring-1 ring-gray-200">
                <div className="flex justify-between gap-x-4">
                  <Link
                    target="_blank"
                    href={`${commitBaseUrl}/${commit.commitHash}`}
                    className="py-0.5 text-xs leading-5 text-gray-500"
                  >
                    <span className="font-medium text-gray-900">
                      {commit.commitAuthorName}
                    </span>{" "}
                    <span className="inline-flex items-center">
                      committed
                      <ExternalLink className="ml-1 size-4" />
                    </span>
                  </Link>
                </div>
                <span className="font-semibold">
                  {commit.commitMessage}
                </span>
                <pre className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-500">
                  {commit.summary}
                </pre>

              </div>
            </li>
          ))}
        </ul>
        ):(
          <div className="flex h-full w-full flex-col items-center justify-center text-center">
            <div className="mt-6 mb-4 animate-pulse text-2xl font-semibold text-gray-700 dark:text-white">
              Loading commits with AI generated summary...
            </div>
            <div className="h-2 w-1/2 animate-pulse rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          </div>
        )
      }
    </>

  );
};

export default CommitLog;
