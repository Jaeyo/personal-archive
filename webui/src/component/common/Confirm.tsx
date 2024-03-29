import React, { FC, useEffect, useRef } from "react"
import { Button, Loading, Modal, ModalFooter, ModalSection } from "@kiwicom/orbit-components"
import styled from "styled-components"
import { If } from "react-if"


interface Props {
  show: boolean
  onOK: () => void
  onClose: () => void
  loading?: boolean
}

const Confirm: FC<Props> = ({show, onOK, onClose, loading = false, children}) => {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (show && ref.current) {
      setTimeout(() => {
        ref?.current?.focus()
      }, 100)
    }
  }, [show])

  return (
    <If condition={show}>
      <Modal
        onClose={onClose}
        size="small"
      >
        <ModalSection>
          <If condition={loading}>
            <Loading type="boxLoader"/>
          </If>
          <If condition={!loading}>
            {children}
          </If>
        </ModalSection>
        <ModalFooter>
          <ButtonWrapper>
            <Button onClick={onOK} type="primary" ref={ref}>
              Ok
            </Button>
            <Button onClick={onClose} type="white">
              Cancel
            </Button>
          </ButtonWrapper>
        </ModalFooter>
      </Modal>
    </If>
  )
}

const ButtonWrapper = styled.div`
  button {
    display: inline-flex;
  }
`

export default Confirm
