import React, { FC, useState } from "react"
import styled from "styled-components"
import { Alert, Button, ControlLabel, Input, Toggle } from "rsuite"
import { requestPocketSync, requestPocketUnauth } from "../../apis/SettingApi"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"

TimeAgo.addLocale(en)
TimeAgo.setDefaultLocale('en-US')


interface Props {
  username: string
  isSyncOn: boolean
  lastSyncTime: Date | null
}

const PocketSettingAuthenticated: FC<Props> = ({ username, isSyncOn, lastSyncTime }) => {
  const [ activateFetching, setActivateFetching ] = useState(false)
  const [ syncToggleFetching, setSyncToggleFetching ] = useState(false)
  const [ isSyncChecked, setSyncChecked ] = useState(isSyncOn)

  const onUnactivate = () => {
    setActivateFetching(true)
    requestPocketUnauth()
      .then(() => window.location.reload())
      .catch(err => Alert.error(err.toString()))
      .finally(() => setActivateFetching(false))
  }

  const onSyncToggle = (checked: boolean) => {
    setSyncToggleFetching(true)
    setSyncChecked(checked)
    requestPocketSync(checked)
      .then(() => Alert.info(`Pocket sync ${checked ? 'ON' : 'OFF'}`))
      .catch(err => Alert.error(err.toString()))
      .finally(() => setSyncToggleFetching(false))
  }

  return (
    <>
      <h1>Pocket: integrated</h1>
      <ControlLabel>Username</ControlLabel>
      <Input value={username} disabled />
      <BtnDiv>
        <Button onClick={onUnactivate} loading={activateFetching} color="red">Unactivate</Button>
      </BtnDiv>
      <ControlLabel>Sync with Pocket</ControlLabel>
      <Toggle
        checked={isSyncChecked}
        checkedChildren="Sync"
        unCheckedChildren="Not Sync"
        disabled={syncToggleFetching}
        onChange={onSyncToggle}
      />
      {
        lastSyncTime == null ?
          null :
          <ControlLabel>Last Sync: {new TimeAgo('en-US').format(new Date(lastSyncTime))}</ControlLabel>
      }
    </>
  )
}

const BtnDiv = styled.div`
  text-align: right;
`

export default PocketSettingAuthenticated
