import { requestGet, requestPut } from "./index"


export const requestGetPocketAuth = async (): Promise<[string, string]> => {
  const resp = await requestGet(`/apis/settings/pocket/auth`)
  return [
    resp.data.applicationKey,
    resp.data.accessToken,
  ]
}

export const requestSetPocketAuth = async (applicationKey: string, accessToken: string): Promise<void> => {
  await requestPut(`/apis/settings/pocket/auth`, {applicationKey, accessToken})
}
