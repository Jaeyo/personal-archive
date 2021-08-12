import React, { FC } from "react"
import styled from "styled-components"
import { useRequestPocketSync, useRequestPocketUnauth } from "../../apis/SettingApi"
import TimeAgo from "javascript-time-ago"
import { Button, List, ListItem, Switch, Tag } from "@kiwicom/orbit-components"
import { ChevronRight } from "@kiwicom/orbit-components/icons"
import { AiOutlineSync } from "react-icons/all"


interface Props {
  username: string
  isSyncOn: boolean
  lastSyncTime: Date | null
}

const PocketSettingAuthenticated: FC<Props> = ({username, isSyncOn: defaultIsSyncOn, lastSyncTime}) => {
  const [deactivateFetching, unauthPocket] = useRequestPocketUnauth()
  const [syncToggleFetching, setPocketSync, isSyncOn] = useRequestPocketSync(defaultIsSyncOn)

  const deactivate = () =>
    unauthPocket()
      .then(() => window.location.reload())

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
            checked={isSyncOn}
            onChange={() => setPocketSync(!isSyncOn)}
            disabled={syncToggleFetching}
          />
          <LastSyncTime lastSyncTime={lastSyncTime}/>
        </ListItem>
      </List>
      <BtnDiv>
        <Button
          onClick={deactivate}
          loading={deactivateFetching}
          type="white"
          size="small"
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


const Desc = styled.span`
  color: gray;
  font-size: 9px;
  margin-left: 10px;
`

const BtnDiv = styled.div`
  text-align: right;
`

export default PocketSettingAuthenticated
