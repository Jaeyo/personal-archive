import React, { FC, useEffect, useState } from "react"
import styled from "styled-components"
import Confirm from "./Confirm"
import { Button, ButtonGroup, InputField, Popover } from "@kiwicom/orbit-components"
import { ChevronDown, Edit } from "@kiwicom/orbit-components/icons"
import { FaTrash } from "react-icons/fa"
import Title from "./Title"


interface Props {
  title: string
  onEdit: (title: string) => void
  onDelete: () => void
  editFetching: boolean
  deleteFetching: boolean
}

const ManagedTitle: FC<Props> = ({title, onEdit, onDelete, editFetching, deleteFetching}) => (
  <div>
    <Title>{title}</Title>
    <Options
      title={title}
      onEdit={onEdit}
      onDelete={onDelete}
      editFetching={editFetching}
      deleteFetching={deleteFetching}
    />
  </div>
)

const Options: FC<{
  title: string,
  onEdit: (title: string) => void,
  onDelete: () => void,
  editFetching: boolean,
  deleteFetching: boolean,
}> = ({title, onEdit, onDelete, editFetching, deleteFetching}) => {
  const [isOpened, setOpened] = useState(false)
  const [isEditPromptOpened, setEditPromptOpened] = useState(false)
  const [isDeleteConfirmOpened, setDeleteConfirmOpened] = useState(false)

  return (
    <ButtonWrapper>
      <Popover
        content={
          <ButtonGroup>
            <Button
              iconLeft={<Edit/>}
              type="secondary"
              onClick={() => {
                setOpened(false)
                setEditPromptOpened(true)
              }}
              size="small"
            >
              Edit
            </Button>
            <Button
              iconLeft={<FaTrash/>}
              type="secondary"
              onClick={() => {
                setOpened(false)
                setDeleteConfirmOpened(true)
              }}
              size="small"
            >
              Delete
            </Button>
          </ButtonGroup>
        }
        opened={isOpened}
        onClose={() => setOpened(false)}
      >
        <Button
          iconLeft={<ChevronDown/>}
          type="white"
          size="small"
          loading={editFetching || deleteFetching}
          onClick={() => setOpened(!isOpened)}
        />
      </Popover>
      <EditPrompt
        isOpened={isEditPromptOpened}
        defaultTitle={title}
        onEdit={onEdit}
        onClose={() => setEditPromptOpened(false)}
      />
      <DeleteConfirm
        isOpened={isDeleteConfirmOpened}
        onDelete={onDelete}
        onClose={() => setDeleteConfirmOpened(false)}
      />
    </ButtonWrapper>
  )
}

const EditPrompt: FC<{
  isOpened: boolean,
  defaultTitle: string,
  onEdit: (title: string) => void,
  onClose: () => void,
}> = ({isOpened, defaultTitle, onEdit, onClose}) => {
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    setNewTitle(defaultTitle)
  }, [defaultTitle])

  return (
    <Confirm
      show={isOpened}
      onOK={() => onEdit(newTitle)}
      onClose={onClose}
    >
      <InputField
        value={newTitle}
        onChange={e => setNewTitle((e.target as any).value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onEdit(newTitle)
          }
        }}
      />
    </Confirm>
  )
}

const DeleteConfirm: FC<{
  isOpened: boolean,
  onDelete: () => void,
  onClose: () => void,
}> = ({isOpened, onDelete, onClose}) => (
  <Confirm
    show={isOpened}
    onOK={onDelete}
    onClose={onClose}
  >
    Delete?
  </Confirm>
)

const ButtonWrapper = styled.div`
  display: inline;
  button {
    display: inline-flex;
  }
  div[class*="Popover_"] {
    display: inline;
  }
`

export default ManagedTitle
