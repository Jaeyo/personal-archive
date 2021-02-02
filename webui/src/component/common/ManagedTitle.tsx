import React, { FC, useState } from "react"
import styled from "styled-components"
import { Button, Icon, IconButton, Input } from "rsuite"
import Confirm from "./Confirm"


interface Props {
  title: string
  onSubmit: (title: string) => void
  onDelete: () => void
  submitFetching: boolean
  deleteFetching: boolean
}

const ManagedTitle: FC<Props> = ({title, onSubmit, onDelete, submitFetching, deleteFetching}) => {
  const [isEditMode, setEditMode] = useState(false)
  const [deleteConfirmShow, setDeleteConfirmShow] = useState(false)
  const [titleModified, setTitleModified] = useState(title)

  const toggleEditMode = (activated: boolean) => {
    setTitleModified(title)
    setEditMode(activated)
  }

  if (!isEditMode) {
    return (
      <div>
        <Title>{title}</Title>
        <IconButton
          icon={<Icon icon="edit"/>}
          onClick={() => toggleEditMode(true)}
          size="xs"
        />
        &nbsp;
        <IconButton
          loading={deleteFetching}
          icon={<Icon icon={"trash"}/>}
          onClick={() => setDeleteConfirmShow(true)}
          size="xs"
        />
        <Confirm
          show={deleteConfirmShow}
          onOK={() => {
            setDeleteConfirmShow(false)
            onDelete()
          }}
          onClose={() => setDeleteConfirmShow(false)}
        >
          DELETE?
        </Confirm>
      </div>
    )
  }

  return (
    <InputDiv>
      <TitleInput value={titleModified} onChange={(v: string) => setTitleModified(v)} onPressEnter={() => onSubmit(titleModified)}/>
      <Button loading={submitFetching} onClick={() => onSubmit(titleModified)}>Submit</Button>
      <Button onClick={() => toggleEditMode(false)}>Cancel</Button>
    </InputDiv>
  )
}

const Title = styled.h1`
  display: inline;
  font-size: 24px;
  margin-right: 20px;
`

const InputDiv = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 18px;
  margin-bottom: 18px;
`

const TitleInput = styled(Input)`
  flex: auto;
`

export default ManagedTitle
