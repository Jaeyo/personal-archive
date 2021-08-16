import { useGet, usePost, usePut } from "./index"
import { AxiosError } from "axios"
import { useCallback, useState } from "react"


export const useRequestObtainPocketRequestToken = (): [
  boolean,
  (consumerKey: string, redirectURI: string) => Promise<void>,
  string,
  AxiosError | null,
] => {
  const [fetching, fetchPost, error] = usePost()
  const [requestToken, setRequestToken] = useState('')

  const obtainPocketRequestToken = (consumerKey: string, redirectURI: string): Promise<void> =>
    fetchPost(`/apis/settings/pocket/request-token`, {consumerKey, redirectURI}, resp => {
      setRequestToken(resp.data.requestToken)
    })

  return [fetching, useCallback(obtainPocketRequestToken, [fetchPost]), requestToken, error]
}

export const useRequestPocketAuth = (): [
  boolean,
  () => Promise<void>,
  boolean,
  AxiosError | null,
] => {
  const [fetching, fetchPost, error] = usePost()
  const [isAllowed, setIsAllowed] = useState(false)

  const authPocket = (): Promise<void> =>
    fetchPost(`/apis/settings/pocket/auth`, {}, resp => {
      setIsAllowed(resp.data.isAllowed)
    })

  return [fetching, useCallback(authPocket, [fetchPost]), isAllowed, error]
}

export const useRequestPocketUnauth = (): [
  boolean,
  () => Promise<void>,
  AxiosError | null,
] => {
  const [fetching, fetchPost, error] = usePost()

  const unauthPocket = (): Promise<void> =>
    fetchPost(`/apis/settings/pocket/unauth`, {})

  return [fetching, useCallback(unauthPocket, [fetchPost]), error]
}

export const useRequestGetPocketAuth = (): [
  boolean,
  () => Promise<void>,
  boolean,
  string,
  boolean,
  Date,
  AxiosError | null,
] => {
  const [fetching, fetchGet, error] = useGet()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [isSyncOn, setIsSyncOn] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState(new Date(0))

  const getPocketAuth = (): Promise<void> =>
    fetchGet(`/apis/settings/pocket/auth`, resp => {
      setIsAuthenticated(resp.data.isAuthenticated)
      setUsername(resp.data.username)
      setIsSyncOn(resp.data.isSyncOn)
      setLastSyncTime(resp.data.lastSyncTime)
    })

  return [fetching, useCallback(getPocketAuth, [fetchGet]), isAuthenticated, username, isSyncOn, lastSyncTime, error]
}

export const useRequestPocketSync = (defaultIsSyncOn: boolean): [
  boolean,
  (isSyncOn: boolean) => Promise<void>,
  boolean,
  AxiosError | null,
] => {
  const [fetching, fetchPut, error] = usePut()
  const [isSyncOn, setIsSyncOn] = useState(defaultIsSyncOn)

  const setPocketSync = (isSyncOn: boolean): Promise<void> => {
    setIsSyncOn(isSyncOn)
    return fetchPut(`/apis/settings/pocket/sync`, {isSyncOn})
  }

  return [fetching, useCallback(setPocketSync, [fetchPut]), isSyncOn, error]
}

export const useRequestGetEditorKeyboardHandler = (): [
  boolean,
  () => Promise<void>,
  string,
  AxiosError | null,
] => {
  const [fetching, fetchGet, error] = useGet()
  const [keyboardHandler, setKeyboardHandler] = useState('')

  const getEditorKeyboardHandler = (): Promise<void> =>
    fetchGet(`/apis/settings/editor/keyboard-handler`, resp => {
      setKeyboardHandler(resp.data.keyboardHandler)
    })

  return [fetching, useCallback(getEditorKeyboardHandler, [fetchGet]), keyboardHandler, error]
}

export const useRequestSetEditorKeyboardHandler = (): [
  boolean,
  (keyboardHandler: string) => Promise<void>,
  AxiosError | null,
] => {
  const [fetching, fetchPut, error] = usePut()

  const setEditorKeyboardHandler = (keyboardHandler: string): Promise<void> =>
    fetchPut(`/apis/settings/editor/keyboard-handler`, { keyboardHandler })

  return [fetching, useCallback(setEditorKeyboardHandler, [fetchPut]), error]
}
