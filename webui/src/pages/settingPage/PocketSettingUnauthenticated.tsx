import React, { FC, useState } from "react"
import { useRequestObtainPocketRequestToken } from "../../apis/SettingApi"
import { toast } from "react-hot-toast"
import { Button, InputField, List, ListItem, Tag, Tooltip } from "@kiwicom/orbit-components"
import { ChevronRight, QuestionCircle } from "@kiwicom/orbit-components/icons"
import styled from "styled-components"


const PocketSettingUnauthenticated: FC = () => {
  const [consumerKey, setConsumerKey] = useState('')
  const [fetching, activate] = useActivate()

  return (
    <List type="primary">
      <ListItem label="Status" icon={<ChevronRight />}>
        <Tag size="small">Disconnected</Tag>
      </ListItem>
      <ListItem
        label={
          <>
            Consumer Key
            &nbsp;
            <Tooltip content={
              <a
                href="https://getpocket.com/developer/docs/authentication"
                target="_blank"
                rel="noreferrer"
                style={{ wordWrap: 'break-word', color: 'white' }}
              >
                https://getpocket.com/developer/docs/authentication
              </a>
            }>
              <QuestionCircle size="small" />
            </Tooltip>
          </>
        }
        icon={<ChevronRight />}
      >
        <ConsumerKeyInputWrapper>
          <InputField
            value={consumerKey}
            onChange={e => setConsumerKey((e.target as any).value)}
            size="small"
          />
          <Button
            onClick={() => activate(consumerKey)}
            loading={fetching}
            size="small"
          >
            Connect
          </Button>
        </ConsumerKeyInputWrapper>
      </ListItem>
    </List>
  )
}

const useActivate = (): [boolean, (consumerKey: string) => void] => {
  const [fetching, obtainPocketRequestToken] = useRequestObtainPocketRequestToken()

  const activate = (consumerKey: string) => {
    if (consumerKey.length <= 0) {
      toast.error('consumer key required')
      return
    }

    const redirectURI = `${window.location.protocol}//${window.location.host}/settings/pocket-auth`
    obtainPocketRequestToken(consumerKey, redirectURI)
      .then(requestToken => {
        window.location.href = `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${redirectURI}`
      })
  }

  return [fetching, activate]
}

const ConsumerKeyInputWrapper = styled.div`
  div[class*="InputField__Field"] {
    display: inline-block;
    margin-top: 6px;
    max-width: 400px;
  }
  
  button {
    display: inline-flex;
    margin-left: 10px;
  }
`

export default PocketSettingUnauthenticated
