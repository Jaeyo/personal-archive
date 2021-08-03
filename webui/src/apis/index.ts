import axios, { AxiosResponse } from "axios"
import { isDev } from "../common/Conf"

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
