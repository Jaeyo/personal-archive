import React, { FC, useEffect, useState } from "react"
import { requestGetPocketAuth } from "../../apis/SettingApi"
import { Alert, Loader } from "rsuite"
import PocketSettingUnauthenticated from "./PocketSettingUnauthenticated"
import PocketSettingAuthenticated from "./PocketSettingAuthenticated"


const PocketSetting: FC = () => {
  const [fetching, setFetching] = useState(false)
  const [isAuthenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState(null as (string | null))
  const [isSyncOn, setSyncOn] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState(null as (Date | null))

  useEffect(() => {
    setFetching(true)
    requestGetPocketAuth()
      .then(([isAuthenticated, username, isSyncOn, lastSyncTime]) => {
        setAuthenticated(isAuthenticated)
        setUsername(username)
        setSyncOn(isSyncOn)
        setLastSyncTime(lastSyncTime)
      })
      .catch(err => Alert.error(err.toString()))
      .finally(() => setFetching(false))
  }, [])

  if (fetching) {
    return <Loader/>
  }

  return isAuthenticated ?
    <PocketSettingAuthenticated
      username={username || ''}
      isSyncOn={isSyncOn}
      lastSyncTime={lastSyncTime}
    /> :
    <PocketSettingUnauthenticated/>
}

export default PocketSetting
