import React, { FC, useState } from "react"
import styled from "styled-components"
import { Alert, Button, ControlLabel, Form, FormGroup, Input, Tag } from "rsuite"
import { requestObtainPocketRequestToken } from "../../apis/SettingApi"


const PocketSettingUnauthenticated: FC = () => {
  const [fetching, setFetching] = useState(false)
  const [consumerKey, setConsumerKey] = useState('')

  const onActivate = () => {
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
      .catch(err => Alert.error(err.toString()))
      .finally(() => setFetching(false))
  }

  return (
    <Form layout="horizontal">
      <FormRow>
        <ControlLabel>Status</ControlLabel>
        <StatusTag color="red">Disconnected</StatusTag>
      </FormRow>
      <FormRow>
        <ControlLabel>Consumer Key</ControlLabel>
        <Input
          value={consumerKey}
          onChange={v => setConsumerKey(v)}
          style={{width: '400px'}}
          size="sm"
        />
        <ConnectBtn
          onClick={onActivate}
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

const FormRow = styled(FormGroup)`
  margin-bottom: 0 !important;
`

const StatusTag = styled(Tag)`
  margin: 8px 0;
`

const ConnectBtn = styled(Button)`
  margin: 4px 0 4px 10px;
`

export default PocketSettingUnauthenticated
