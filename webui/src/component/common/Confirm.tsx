import React, { FC } from "react"
import { Button, Modal } from "rsuite"


interface Props {
  show: boolean
  onOK: () => void
  onClose: () => void
}

const Confirm: FC<Props> = ({show, onOK, onClose, children}) => (
  <Modal backdrop="static" show={show} onHide={onClose} size="xs">
    <Modal.Body>
      {children}
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={onOK} appearance="primary">
        Ok
      </Button>
      <Button onClick={onClose} appearance="subtle">
        Cancel
      </Button>
    </Modal.Footer>
  </Modal>
)

export default Confirm
