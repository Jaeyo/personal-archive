import React, { FC, useState } from "react"
import { Alert, Button, Drawer, Input } from "rsuite"


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
      Alert.error('url required')
      return
    }

    if (!url.startsWith('http')) {
      Alert.error('invalid url')
      return
    }

    clear()
    onConfirm(url)
  }

  return (
    <Drawer show={show} onHide={onClose}>
      <Drawer.Header>
        <Drawer.Title>Add Web Reference</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <Input value={url} onChange={setUrl} placeholder="url" onPressEnter={onSubmit}/>
      </Drawer.Body>
      <Drawer.Footer>
        <Button onClick={onSubmit} appearance="primary">Add</Button>
        <Button onClick={onClose} appearance="subtle">Cancel</Button>
      </Drawer.Footer>
    </Drawer>
  )
}

export default AddReferenceWebDrawer
