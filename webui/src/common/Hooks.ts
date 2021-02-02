import { useLocation } from "react-router-dom"
import { useEffect, useRef } from "react"


export const useQuery = () => new URLSearchParams(useLocation().search)

export const usePage = (): number => {
  const query = useQuery()
  return parseInt(query.get('page') || '1', 10)
}

export const usePrevious = <T>(value: T): T => {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [ value ])

  return ref.current!
}
