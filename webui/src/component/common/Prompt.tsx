import React, { FC, useEffect, useState } from "react"
import { Button, Input, Modal } from "rsuite"


interface Props {
  show: boolean
  placeholder?: string
  initialValue?: string
  onOK: (value: string) => void
  onClose: () => void
}

const Prompt: FC<Props> = ({show, placeholder, initialValue, onOK, onClose, children}) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (initialValue != null) {
      setValue(initialValue)
    }
  }, [initialValue])

  return (
    <Modal backdrop="static" show={show} onHide={onClose} size="xs">
      <Modal.Body>
        {children}
        <Input placeholder={placeholder} value={value} onChange={setValue}/>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => onOK(value)} appearance="primary">
          Ok
        </Button>
        <Button onClick={onClose} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Prompt
