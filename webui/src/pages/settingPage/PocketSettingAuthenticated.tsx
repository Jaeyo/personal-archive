import React, { FC, useState } from "react"
import styled from "styled-components"
import { Alert, Button, Form, Tag, Toggle } from "rsuite"
import TimeAgo from "javascript-time-ago"
import { requestPocketSync, requestPocketUnauth } from "../../apis/SettingApi"
import en from "javascript-time-ago/locale/en"
import { FormLabel, FormRow, FormValue } from "../../component/common/Form"

TimeAgo.addLocale(en)
TimeAgo.setDefaultLocale('en-US')


interface Props {
  username: string
  isSyncOn: boolean
  lastSyncTime: Date | null
}

const PocketSettingAuthenticated: FC<Props> = ({username, isSyncOn, lastSyncTime}) => {
  const [activateFetching, setActivateFetching] = useState(false)
  const [syncToggleFetching, setSyncToggleFetching] = useState(false)
  const [isSyncChecked, setSyncChecked] = useState(isSyncOn)

  const onUnactivate = () => {
    setActivateFetching(true)
    requestPocketUnauth()
      .then(() => window.location.reload())
      .catch(err => {
        Alert.error(err.toString())
        setActivateFetching(false)
      })
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
            onChange={onSyncToggle}
          />
          <LastSyncTime lastSyncTime={lastSyncTime}/>
        </FormRow>
      </Form>
      <BtnDiv>
        <Button
          onClick={onUnactivate}
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
