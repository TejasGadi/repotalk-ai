import { ExternalLink } from "lucide-react"
import Link from "next/link"
import useProject from "~/hooks/use-project"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"

const CommitLog = () => {
  const { selectedProjectId, project } = useProject();
  const commitBaseUrl = `${project?.githubUrl}/commits`;

  const { data: commits } = api.project.getCommits.useQuery({
    projectId: selectedProjectId,
  });

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 ml-2">Recent Commits</h1>
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
    </>
  );
};

export default CommitLog;
