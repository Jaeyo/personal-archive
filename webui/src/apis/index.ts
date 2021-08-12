import axios, { AxiosError, AxiosResponse } from "axios"
import { isDev } from "../common/Conf"
import { useCallback, useState } from "react"
import { toast } from "react-hot-toast"

const fullURL = (url: string): string =>
  isDev() ? 'http://localhost:1113' + url : url

export const requestGet = (url: string): Promise<AxiosResponse> => handleError(() => axios.get(fullURL(url)))
export const requestPost = (url: string, body: any): Promise<AxiosResponse> => handleError(() => axios.post(fullURL(url), body))
export const requestPut = (url: string, body: any): Promise<AxiosResponse> => handleError(() => axios.put(fullURL(url), body))
export const requestDelete = (url: string): Promise<AxiosResponse> => handleError(() => axios.delete(fullURL(url)))

const handleError = async (fn: () => any) => {
  try {
    return await fn()
  } catch (err) {
    if (err != null && err.response != null && err.response.data != null && err.response.data.message != null) {
      err.message = err.response.data.message
      throw err
    }
  }
}

const useApi = (): [
  boolean,
  (apiFn: () => Promise<void>) => Promise<void>,
  AxiosError | null,
] => {
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState(null as AxiosError | null)

  const fetchData = (apiFn: () => Promise<void>) =>
    apiFn()
      .catch(err => {
        if (err) {
          if (err.response != null && err.response.data != null && err.response.data.message != null) {
            err.message = err.response.data.message
          }
          toast.error(err.toString())
          setError(err)
          console.error({ err })
        }
      })
      .finally(() => setFetching(false))

  return [ fetching, useCallback(fetchData, []), error ]
}

type Callback = (resp: AxiosResponse) => void

export const useGet = (): [
  boolean,
  (url: string, cb?: Callback) => Promise<void>,
  AxiosError | null,
] => {
  const [ fetching, fetchData, error ] = useApi()
  const fetchGet = (url: string, cb?: Callback): Promise<void> =>
    fetchData(
      () => axios.get(fullURL(url))
        .then(resp => cb && cb(resp))
    )
  return [fetching, useCallback(fetchGet, [fetchData]), error ]
}

export const usePost = (): [
  boolean,
  (url: string, body: any, cb?: Callback) => Promise<void>,
  AxiosError | null,
] => {
  const [ fetching, fetchData, error ] = useApi()
  const fetchPost = (url: string, body: any, cb?: Callback): Promise<void> =>
    fetchData(
      () => axios.post(fullURL(url), body)
        .then(resp => cb && cb(resp))
    )
  return [fetching, useCallback(fetchPost, [fetchData]), error]
}

export const usePut = (): [
  boolean,
  (url: string, body: any, cb?: Callback) => Promise<void>,
  AxiosError | null,
] => {
  const [ fetching, fetchData, error ] = useApi()
  const fetchPut = (url: string, body: any, cb?: Callback): Promise<void> =>
    fetchData(
      () => axios.put(fullURL(url), body)
        .then(resp => cb && cb(resp))
    )
  return [fetching, useCallback(fetchPut, [fetchData]), error]
}

export const useDelete = (): [
  boolean,
  (url: string, cb?: Callback) => Promise<void>,
  AxiosError | null,
] => {
  const [ fetching, fetchData, error ] = useApi()
  const fetchDelete = (url: string, cb?: Callback): Promise<void> =>
    fetchData(
      () => axios.delete(fullURL(url))
        .then(resp => cb && cb(resp))
    )
  return [fetching, useCallback(fetchDelete, [fetchData]), error]
}

