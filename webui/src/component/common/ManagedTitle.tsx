import React, { FC, useState } from "react"
import styled from "styled-components"
import { Button, ButtonGroup, Popover } from "@kiwicom/orbit-components"
import { ChevronDown, Edit } from "@kiwicom/orbit-components/icons"
import { FaTrash } from "react-icons/fa"
import Title from "./Title"


interface Props {
  title: string
  onEdit: () => void
  onDelete: () => void
}

const ManagedTitle: FC<Props> = ({title, onDelete, onEdit}) => (
  <div>
    <Title>{title}</Title>
    <Options
      onEdit={onEdit}
      onDelete={onDelete}
    />
  </div>
)

const Options: FC<{
  onEdit: () => void,
  onDelete: () => void,
}> = ({onEdit, onDelete}) => {
  const [isOpened, setOpened] = useState(false)

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
                onEdit()
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
                onDelete()
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
          onClick={() => setOpened(!isOpened)}
        />
      </Popover>
    </ButtonWrapper>
  )
}

const ButtonWrapper = styled.div`
  display: inline;
  margin-left: 30px;
  
  button {
    display: inline-flex;
  }
  div[class*="Popover_"] {
    display: inline;
  }
`

export default ManagedTitle
