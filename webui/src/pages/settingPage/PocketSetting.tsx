import React, { FC, useEffect, useState } from "react"
import { Alert, Loader } from "rsuite"
import { Else, If, Then } from "react-if"
import { requestGetPocketAuth } from "../../apis/SettingApi"
import PocketSettingUnauthenticated from "./PocketSettingUnauthenticated"
import PocketSettingAuthenticated from "./PocketSettingAuthenticated"


const PocketSetting: FC = () => {
  const [fetching, isAuthenticated, username, isSyncOn, lastSyncTime] = useRequestGetPocketAuth()

  if (fetching) {
    return <Loader/>
  }

  return (
    <If condition={isAuthenticated}>
      <Then>
        <PocketSettingAuthenticated
          username={username || ''}
          isSyncOn={isSyncOn}
          lastSyncTime={lastSyncTime}
        />
      </Then>
      <Else>
        <PocketSettingUnauthenticated/>
      </Else>
    </If>
  )
}

const useRequestGetPocketAuth = (): [boolean, boolean, string | null, boolean, Date | null] => {
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

  return [fetching, isAuthenticated, username, isSyncOn, lastSyncTime]
}

export default PocketSetting
