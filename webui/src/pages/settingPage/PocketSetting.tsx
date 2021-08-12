import React, { FC, useEffect } from "react"
import { Else, If, Then } from "react-if"
import { useRequestGetPocketAuth } from "../../apis/SettingApi"
import PocketSettingUnauthenticated from "./PocketSettingUnauthenticated"
import PocketSettingAuthenticated from "./PocketSettingAuthenticated"
import { Loading } from "@kiwicom/orbit-components"


const PocketSetting: FC = () => {
  const [fetching, getPocketAuth, isAuthenticated, username, isSyncOn, lastSyncTime] = useRequestGetPocketAuth()

  useEffect(() => {
    getPocketAuth()
  }, [ getPocketAuth ])

  if (fetching) {
    return <Loading type="boxLoader"/>
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

export default PocketSetting
