import { useLocation } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { subscribe, unsubscribe } from "./EventBus"
import Mousetrap from "mousetrap"


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

export const useLocalStorage = (key: string, defaultValue: string): [
  string,
  (value: string) => void,
] => {
  const [value, setValue] = useState(localStorage.getItem(key) || defaultValue)

  useEffect(() => {
    localStorage.setItem(key, value)
  }, [key, value])

  return [value, setValue]
}

export const useSubscribe = (event: string, callback: (data: any) => void) =>
  useEffect(() => {
    subscribe(event, callback)
    return () => unsubscribe(event, callback)
  }, [event, callback])

export const useHotKeys = (hotKeys: string, callback: () => void) =>
  useEffect(() => {
    Mousetrap.bind(hotKeys, callback)
    return () => { Mousetrap.unbind(hotKeys) }
  }, [hotKeys, callback])
