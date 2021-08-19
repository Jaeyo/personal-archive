import React, { FC, ReactNode, useEffect, useRef, useState } from "react"
import { useHotKeys, useSubscribe } from "../../common/Hooks"
import { OpenGlobalPrompt, publish } from "../../common/EventBus"
import Confirm from "../common/Confirm"
import { InputField } from "@kiwicom/orbit-components"


type InputType = "text" | "number" | "email" | "password" | "passportid"

interface PromptEvent {
  message: string | ReactNode
  initialValue?: string
  inputType?: InputType
  onOK: (input: string) => Promise<void>
  onCancel?: () => void
}

const GlobalPrompt: FC = () => {
  const [loading, setLoading] = useState(false)
  const [isOpened, setOpened] = useState(false)
  const [promptEvent, setPromptEvent] = useState(null as PromptEvent | null)
  const [input, setInput] = useState('')
  const [inputType, setInputType] = useState('text' as InputType)
  const ref = useRef<HTMLInputElement>(null)

  useSubscribe(OpenGlobalPrompt, (e: PromptEvent) => {
    setPromptEvent(e)
    e.initialValue && setInput(e.initialValue)
    setOpened(true)
  })

  useHotKeys('esc', () => {
    if (isOpened) {
      setOpened(false)
    }
  })

  useEffect(() => {
    if (isOpened && ref.current) {
      setTimeout(() => ref?.current?.focus(), 100)
    }
  }, [isOpened])

  const clear = () => {
    setOpened(false)
    setPromptEvent(null)
    setInput('')
    setInputType('text')
  }

  const onOK = async () => {
    try {
      setLoading(true)
      promptEvent && await promptEvent.onOK(input)
    } finally {
      setLoading(false)
      clear()
    }
  }

  const onCancel = () => {
    setOpened(false)
    promptEvent && promptEvent.onCancel && promptEvent.onCancel()
    clear()
  }

  return (
    <Confirm
      show={isOpened}
      onOK={onOK}
      onClose={onCancel}
      loading={loading}
    >
      <>
        {promptEvent && promptEvent.message}
        <InputField
          ref={ref}
          value={input}
          type={inputType}
          onChange={e => setInput((e.target as any).value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onOK()
            }
          }}
        />
      </>
    </Confirm>
  )
}

export const prompt = (e: PromptEvent): void => {
  publish(OpenGlobalPrompt, e)
}

export default GlobalPrompt
