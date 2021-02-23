import React, { FC, useState } from "react"
import styled from "styled-components"
import { Alert, Button, Form, Tag, Toggle } from "rsuite"
import { requestPocketSync, requestPocketUnauth } from "../../apis/SettingApi"
import { FormLabel, FormRow, FormValue } from "../../component/common/Form"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"

TimeAgo.addLocale(en)
TimeAgo.setDefaultLocale('en-US')


interface Props {
  username: string
  isSyncOn: boolean
  lastSyncTime: Date | null
}

const PocketSettingAuthenticated: FC<Props> = ({username, isSyncOn, lastSyncTime}) => {
  const [activateFetching, deactivate] = useDeactivate()
  const [syncToggleFetching, isSyncChecked, syncToggle] = useSyncToggle(isSyncOn)

  return (
    <>
      <Form layout="horizontal">
        <FormRow>
          <FormLabel>Status</FormLabel>
          <StatusTag color="green">Connected</StatusTag>
        </FormRow>
        <FormRow>
          <FormLabel>Username</FormLabel>
          <FormValue>{username}</FormValue>
        </FormRow>
        <FormRow>
          <FormLabel>Sync</FormLabel>
          <SyncToggle
            checked={isSyncChecked}
            checkedChildren="Sync"
            unCheckedChildren="Not Sync"
            disabled={syncToggleFetching}
            onChange={syncToggle}
          />
          <LastSyncTime lastSyncTime={lastSyncTime}/>
        </FormRow>
      </Form>
      <BtnDiv>
        <Button
          onClick={deactivate}
          loading={activateFetching}
          color="red"
          appearance="ghost"
          size="sm"
        >
          Disconnect
        </Button>
      </BtnDiv>
    </>
  )
}

const useDeactivate = (): [boolean, () => void] => {
  const [fetching, setFetching] = useState(false)

  const deactivate = () => {
    setFetching(true)
    requestPocketUnauth()
      .then(() => window.location.reload())
      .catch(err => {
        Alert.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, deactivate]
}

const useSyncToggle = (isSyncOn: boolean): [boolean, boolean, (checked: boolean) => void] => {
  const [fetching, setFetching] = useState(false)
  const [isSyncChecked, setSyncChecked] = useState(isSyncOn)

  const syncToggle = (checked: boolean) => {
    setFetching(true)
    setSyncChecked(checked)
    requestPocketSync(checked)
      .then(() => Alert.info(`Pocket sync ${checked ? 'ON' : 'OFF'}`))
      .catch(err => Alert.error(err.toString()))
      .finally(() => setFetching(false))
  }

  return [fetching, isSyncChecked, syncToggle]
}

const LastSyncTime: FC<{ lastSyncTime: Date | null }> = ({lastSyncTime}) =>
  lastSyncTime == null ?
    null :
    <Desc>Last Sync: {new TimeAgo('en-US').format(new Date(lastSyncTime))}</Desc>


const StatusTag = styled(Tag)`
  margin: 8px 0;
`

const SyncToggle = styled(Toggle)`
  margin: 8px 0;
`

const Desc = styled.span`
  color: gray;
  font-size: 9px;
  margin-left: 10px;
`

const BtnDiv = styled.div`
  text-align: right;
`

export default PocketSettingAuthenticated
