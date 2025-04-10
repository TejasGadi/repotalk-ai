"use client"

import React, { useState } from 'react'
import useProject from '~/hooks/use-project'
import { api } from '~/trpc/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const TeamMembers = () => {
  const { selectedProjectId: projectId } = useProject()
  const { data: members = [] } = api.project.getTeamMembers.useQuery({ projectId })
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant="outline" className='text-sm'>View Team Members</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Team Members</DialogTitle>
          <DialogDescription>List of all members in this project</DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-4 max-h-[300px] overflow-y-auto">
          {members.length === 0 ? (
            <p className="text-sm text-gray-500">No team members found.</p>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between bg-gray-50 p-2 rounded-md shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={member.user.imageUrl || "/default_avatar.png"}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <p className="text-sm font-medium text-gray-800">
                    {member.user.emailAddress}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TeamMembers
