import { api } from "~/trpc/react"
import {useLocalStorage} from "usehooks-ts"

const useProject = () => {
  const {data: projects} = api.project.getProjects.useQuery()
//   To keep track of selected project even after page refresh
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage("repoTalkProjectId", " ")

  const project = projects?.find(proj => proj.id == selectedProjectId)

  return {
    projects,
    project,
    selectedProjectId,
    setSelectedProjectId
  }
}

export default useProject
