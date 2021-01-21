import React, { FC, useState } from "react"
import styled from "styled-components"
import { Alert, Button, ControlLabel, Input } from "rsuite"
import { requestObtainPocketRequestToken } from "../../apis/SettingApi"


const PocketSettingUnauthenticated: FC = () => {
  const [ fetching, setFetching ] = useState(false)
  const [ consumerKey, setConsumerKey ] = useState('')

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
    <>
      <h1>Pocket: not integrated</h1>
      <ControlLabel>Consumer Key</ControlLabel>
      <Input value={consumerKey} onChange={v => setConsumerKey(v)} />
      <BtnDiv>
        <Button onClick={onActivate} loading={fetching}>Activate</Button>
      </BtnDiv>
    </>
  )
}

const BtnDiv = styled.div`
  text-align: right;
`

export default PocketSettingUnauthenticated
