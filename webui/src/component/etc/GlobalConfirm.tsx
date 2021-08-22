import React, { FC, ReactNode, useState } from "react"
import { useSubscribe } from "../../common/Hooks"
import { OpenGlobalConfirm, publish } from "../../common/EventBus"
import Confirm from "../common/Confirm"


interface ConfirmEvent {
  message: string | ReactNode
  onOK: () => Promise<void>
  onCancel?: () => void
}

const GlobalConfirm: FC = () => {
  const [loading, setLoading] = useState(false)
  const [isOpened, setOpened] = useState(false)
  const [confirmEvent, setConfirmEvent] = useState(null as ConfirmEvent | null)

  useSubscribe(OpenGlobalConfirm, (e: ConfirmEvent) => {
    setConfirmEvent(e)
    setOpened(true)
  })

  const onOK = async () => {
    try {
      setLoading(true)
      confirmEvent && await confirmEvent.onOK()
    } finally {
      setLoading(false)
      setOpened(false)
      setConfirmEvent(null)
    }
  }

  const onCancel = () => {
    setOpened(false)
    confirmEvent && confirmEvent.onCancel && confirmEvent.onCancel()
    setConfirmEvent(null)
  }

  return (
    <Confirm
      show={isOpened}
      onOK={onOK}
      onClose={onCancel}
      loading={loading}
    >
      {confirmEvent && confirmEvent.message}
    </Confirm>
  )
}

export const confirm = (e: ConfirmEvent): void => {
  publish(OpenGlobalConfirm, e)
}

export default GlobalConfirm
