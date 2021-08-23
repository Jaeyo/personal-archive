import React, { FC, useState } from "react"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import Paragraph from "../../models/Paragraph"
import { Button, ButtonGroup, Popover } from "@kiwicom/orbit-components"
import { ChevronDown, ChevronUp, Edit } from "@kiwicom/orbit-components/icons"
import { FaTrash } from "react-icons/fa"
import { confirm } from "../../component/etc/GlobalConfirm"
import { useRequestDeleteParagraph } from "../../apis/NoteApi"


interface Props {
  paragraph: Paragraph
  onMoveUp: (seq: number) => void
  onMoveDown: (seq: number) => void
  onReload: () => void
}

const NoteParagraphButtons: FC<Props> = ({paragraph, onMoveUp, onMoveDown, onReload}) => {
  const [opened, setOpened] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, deleteParagraph] = useRequestDeleteParagraph()
  const history = useHistory()

  const onDelete = () => {
    setOpened(false)
    confirm({
      message: 'delete paragraph?',
      onOK: () =>
        deleteParagraph(paragraph.id, paragraph.noteID)
          .then(() => onReload())
    })
  }

  return (
    <Wrapper>
      <Popover
        preferredPosition="bottom"
        opened={opened}
        onClose={() => setOpened(false)}
        content={
          <ButtonGroup>
            <Button
              iconLeft={<ChevronUp/>}
              onClick={() => onMoveUp(paragraph.seq)}
              type="secondary"
              size="small"
            >
              Up
            </Button>
            <Button
              iconLeft={<ChevronDown/>}
              onClick={() => onMoveDown(paragraph.seq)}
              type="secondary"
              size="small"
            >
              Down
            </Button>
            <Button
              iconLeft={<Edit/>}
              onClick={() => history.push(`/notes/${paragraph.noteID}/paragraphs/${paragraph.id}/edit`)}
              type="secondary"
              size="small"
            >
              Edit
            </Button>
            <Button
              iconLeft={<FaTrash/>}
              onClick={onDelete}
              type="secondary"
              size="small"
            >
              Delete
            </Button>
          </ButtonGroup>
        }
      >
        <Button
          iconLeft={<ChevronDown/>}
          type="white"
          onClick={() => setOpened(true)}
        />
      </Popover>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  text-align: right;
  div[class*="Popover_"] {
    display: inline;
  }
  button {
    display: inline-flex;
  }
`

export default NoteParagraphButtons
