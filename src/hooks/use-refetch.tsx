import { useQueryClient } from '@tanstack/react-query' 

const useRefetch = () => {
  const queryclient = useQueryClient()

  return async ()=>{
    await queryclient.refetchQueries({type: "active"})
  }
}

export default useRefetch