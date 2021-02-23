import React, { FC, useState } from "react"
import styled from "styled-components"
import { Alert, Button, Form, Icon, Input, Tag, Tooltip, Whisper } from "rsuite"
import { requestObtainPocketRequestToken } from "../../apis/SettingApi"
import { FormLabel, FormRow } from "../../component/common/Form"


const PocketSettingUnauthenticated: FC = () => {
  const [consumerKey, setConsumerKey] = useState('')
  const [fetching, activate] = useActivate()

  return (
    <Form layout="horizontal">
      <FormRow>
        <FormLabel>Status</FormLabel>
        <StatusTag color="red">Disconnected</StatusTag>
      </FormRow>
      <FormRow>
        <FormLabel>
          Consumer Key
          &nbsp;
          <Whisper placement="right" trigger="click" speaker={
            <Tooltip>
              <a href="https://getpocket.com/developer/docs/authentication" target="_blank" rel="noreferrer">
                https://getpocket.com/developer/docs/authentication
              </a>
            </Tooltip>
          }>
            <Icon icon="question" style={{cursor: 'pointer'}}/>
          </Whisper>
        </FormLabel>

        <Input
          value={consumerKey}
          onChange={v => setConsumerKey(v)}
          style={{maxWidth: '400px'}}
          size="sm"
        />
        <ConnectBtn
          onClick={activate}
          loading={fetching}
          color="green"
          size="sm"
        >
          Connect
        </ConnectBtn>
      </FormRow>
    </Form>
  )
}

const useActivate = (): [boolean, (consumerKey: string) => void] => {
  const [fetching, setFetching] = useState(false)

  const activate = (consumerKey: string) => {
    if (consumerKey.length <= 0) {
      Alert.error('consumer key required')
      return
    }

    const redirectURI = `${window.location.protocol}//${window.location.host}/settings/pocket-auth`
    setFetching(true)
    requestObtainPocketRequestToken(consumerKey, redirectURI)
      .then(requestToken => {
        window.location.href = `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${redirectURI}`
      })
      .catch(err => {
        Alert.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, activate]
}

const StatusTag = styled(Tag)`
  margin: 8px 0;
`

const ConnectBtn = styled(Button)`
  margin: 4px 0 4px 10px;
`

export default PocketSettingUnauthenticated
