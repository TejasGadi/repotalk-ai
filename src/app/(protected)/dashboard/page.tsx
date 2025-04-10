"use client";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import useProject from "~/hooks/use-project";
import CommitLog from "./commitlog";
import AskQuestionCard from "./ask-question-card";
import ArchiveButton from "./archive-button";
// import InviteButton from "./invite-button";
const InviteButton = dynamic(()=>import('./invite-button'), {ssr: false})
import TeamMembers from "./team-members";
import dynamic from "next/dynamic";

const DashboardPage = () => {
  const { project } = useProject();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        {/* <p>Project Id: {project?.id}</p> */}
        
        {/* Github Link */}
        <div className="flex w-fit rounded-md bg-primary px-4 py-3">
          <Github className="size-5 text-white" />
          <div className="ml-2">
            <p className="text-sm font-medium text-white">
              This project is linked to{" "}
              <Link
                href={project?.githubUrl ?? ""}
                className="inline-flex items-center text-white/80 hover:underline"
              >
                {project?.githubUrl}
                <ExternalLink className="ml-1 size-4" />
              </Link>
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <TeamMembers/>
          <InviteButton/>
          <ArchiveButton/>
        </div>
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <AskQuestionCard/>
          {/* MeetingCard */}
        </div>
      </div>

      <div className="mt-8"></div>
      <CommitLog/>
    </div>
  );
};

export default DashboardPage;
