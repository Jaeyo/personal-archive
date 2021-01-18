import { useLocation } from "react-router-dom"


export const useQuery = () => new URLSearchParams(useLocation().search)

export const usePage = (): number => {
  const query = useQuery()
  return parseInt(query.get('page') || '1', 10)
}
