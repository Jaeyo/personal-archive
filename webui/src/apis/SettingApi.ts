import { requestGet, requestPost, requestPut } from "./index"


export const requestObtainPocketRequestToken = async (consumerKey: string, redirectURI: string): Promise<string> => {
  const resp = await requestPost(`/apis/settings/pocket/request-token`, {consumerKey, redirectURI})
  return resp.data.requestToken
}

export const requestPocketAuth = async (): Promise<boolean> => {
  const resp = await requestPost(`/apis/settings/pocket/auth`, {})
  return resp.data.isAllowed
}

export const requestPocketUnauth = async (): Promise<void> => {
  await requestPost(`/apis/settings/pocket/unauth`, {})
}

export const requestGetPocketAuth = async (): Promise<[boolean, string, boolean, Date]> => {
  const resp = await requestGet(`/apis/settings/pocket/auth`)
  return [
    resp.data.isAuthenticated,
    resp.data.username,
    resp.data.isSyncOn,
    resp.data.lastSyncTime,
  ]
}

export const requestPocketSync = async (isSyncOn: boolean): Promise<void> => {
  await requestPut(`/apis/settings/pocket/sync`, {isSyncOn})
}
