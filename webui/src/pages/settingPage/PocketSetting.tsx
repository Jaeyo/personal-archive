import React, { FC, useEffect, useState } from "react"
import styled from "styled-components"
import { Alert, Button, ControlLabel, Input, Toggle } from "rsuite"
import { requestGetPocketAuth, requestSetPocketAuth } from "../../apis/SettingApi"
import Confirm from "../../component/common/Confirm"


const PocketSetting: FC = () => {
  const [ fetching, setFetching ] = useState(false)
  const [ appKey, setAppKey ] = useState('')
  const [ accessToken, setAccessToken ] = useState('')

  useEffect(() => {
    setFetching(true)
    requestGetPocketAuth()
      .then(([ appKey, accessToken ]) => {
        setAppKey(appKey)
        setAccessToken(accessToken)
      })
      .catch(err => Alert.error(err.toString()))
      .finally(() => setFetching(false))
  }, [])

  const setPocketAuth = (appKey: string, accessToken: string) => {
    setFetching(true)
    requestSetPocketAuth(appKey, accessToken)
      .then(() => Alert.info('pocket auth set'))
      .catch(err => Alert.error(err.toString()))
      .finally(() => setFetching(false))
  }

  const onClear = () => {
    setAppKey('')
    setAccessToken('')
    setPocketAuth('', '')
  }
  const onSubmit = () => setPocketAuth(appKey, accessToken)

  return (
    <>
      <ControlLabel>Application Key</ControlLabel>
      <ShortInput disabled={fetching} value={appKey} onChange={(v: string) => setAppKey(v)}/>
      <ControlLabel>Access Token</ControlLabel>
      <ShortInput disabled={fetching} value={accessToken} onChange={(v: string) => setAccessToken(v)}/>
      <BtnWrapper>
        <ResetButton onReset={onClear} fetching={fetching} />
        <Button appearance="primary" loading={fetching} onClick={onSubmit}>Update</Button>
      </BtnWrapper>
      <hr/>
      <ControlLabel>Sync pocket's documents with personal archive</ControlLabel>
      &nbsp;
      &nbsp;
      <Toggle/>
    </>
  )
}

const ResetButton: FC<{
  onReset: () => void,
  fetching: boolean,
}> = ({ onReset, fetching }) => {
  const [ resetConfirmShow, setDeleteConfirmShow ] = useState(false)

  const onClick = () => setDeleteConfirmShow(true)

  const onConfirm = () => {
    setDeleteConfirmShow(false)
    onReset()
  }

  return (
    <>
      <Button appearance="subtle" loading={fetching} onClick={onClick}>Reset</Button>
      <Confirm show={resetConfirmShow} onOK={onConfirm} onClose={() => setDeleteConfirmShow(false)}>
        Reset pocket auth
      </Confirm>
    </>
  )
}

const ShortInput = styled(Input)`
  max-width: 400px;
  margin-bottom: 15px;
`

const BtnWrapper = styled.div`
  text-align: right;
  margin-top: 10px;
`

export default PocketSetting
