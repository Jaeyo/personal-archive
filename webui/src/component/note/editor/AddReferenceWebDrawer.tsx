import React, { FC, useState } from "react"
import { toast } from "react-hot-toast"
import { Button, Drawer, InputField } from "@kiwicom/orbit-components"
import { FaSearch } from "react-icons/fa"
import styled from "styled-components"


interface Props {
  show: boolean
  onConfirm: (url: string) => void
  onCancel: () => void
}

const AddReferenceWebDrawer: FC<Props> = ({show, onConfirm, onCancel}) => {
  const [url, setUrl] = useState('')

  const clear = () => {
    setUrl('')
  }

  const onClose = () => {
    clear()
    onCancel()
  }

  const onSubmit = () => {
    if (url.length === 0) {
      toast.error('url required')
      return
    }

    if (!url.startsWith('http')) {
      toast.error('invalid url')
      return
    }

    clear()
    onConfirm(url)
  }

  return (
    <>
      <Drawer shown={show} onClose={onClose} title="Add Web Reference">
        <InputField
          size="small"
          value={url}
          onChange={e => setUrl((e.target as any).value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onSubmit()
            }
          }}
          suffix={
            <span role="button" onClick={onSubmit} style={{ marginRight: '10px' }}>
            <FaSearch />
          </span>
          }
        />
        <ButtonWrapper>
          <Button onClick={onSubmit} size="small">Add</Button>
        </ButtonWrapper>
      </Drawer>
    </>
  )
}

const ButtonWrapper = styled.div`
  text-align: right;
  margin-top: 10px;
  
  button {
    display: inline-flex;
  }
`

export default AddReferenceWebDrawer
