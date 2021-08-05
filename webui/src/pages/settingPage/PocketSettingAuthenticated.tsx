import React, { FC, useState } from "react"
import styled from "styled-components"
import { requestPocketSync, requestPocketUnauth } from "../../apis/SettingApi"
import TimeAgo from "javascript-time-ago"
import { toast } from "react-hot-toast"
import { Button, List, ListItem, Switch, Tag } from "@kiwicom/orbit-components"
import { ChevronRight } from "@kiwicom/orbit-components/icons"
import { AiOutlineSync } from "react-icons/all"


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
      <List type="primary">
        <ListItem label="Status" icon={<ChevronRight />}>
          <Tag selected size="small">Connected</Tag>
        </ListItem>
        <ListItem label="Username" icon={<ChevronRight />}>
          <span>{username}</span>
        </ListItem>
        <ListItem label="Sync" icon={<ChevronRight />}>
          <Switch
            icon={<AiOutlineSync />}
            checked={isSyncChecked}
            onChange={() => syncToggle(!isSyncChecked)}
            disabled={syncToggleFetching}
          />
          <LastSyncTime lastSyncTime={lastSyncTime}/>
        </ListItem>
      </List>
      <BtnDiv>
        <Button
          onClick={deactivate}
          loading={activateFetching}
          type="white"
          size="small"
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
        toast.error(err.toString())
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
      .then(() => toast.success(`Pocket sync ${checked ? 'ON' : 'OFF'}`))
      .catch(err => toast.error(err.toString()))
      .finally(() => setFetching(false))
  }

  return [fetching, isSyncChecked, syncToggle]
}

const LastSyncTime: FC<{ lastSyncTime: Date | null }> = ({lastSyncTime}) =>
  lastSyncTime == null ?
    null :
    <Desc>Last Sync: {new TimeAgo('en-US').format(new Date(lastSyncTime))}</Desc>


const Desc = styled.span`
  color: gray;
  font-size: 9px;
  margin-left: 10px;
`

const BtnDiv = styled.div`
  text-align: right;
`

export default PocketSettingAuthenticated
