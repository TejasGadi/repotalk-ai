import React from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import useProject from '~/hooks/use-project'
import useRefetch from '~/hooks/use-refetch'
import { api } from '~/trpc/react'

const ArchiveButton = () => {
    const archiveProject = api.project.archiveProject.useMutation()
    const {selectedProjectId: projectId} = useProject()
    const refetch = useRefetch()
  return (
    <Button disabled={archiveProject.isPending} size={"sm"} variant={"destructive"} onClick={()=>{
        const confirm = window.confirm("Are you sure you want to archieve this project?")
        if(confirm){
            archiveProject.mutate({
                projectId:projectId
            }, {
                onSuccess() {
                    toast.success("Project successfully archived")
                    refetch()
                },
                onError(error) {
                    toast.error(`Failed to archieve project. Error :${error}`)
                },
            })
        }
    }}>
        Archive
    </Button>
  )
}

export default ArchiveButton
