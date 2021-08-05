import React, { FC, useState } from "react"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import Paragraph from "../../models/Paragraph"
import Confirm from "../../component/common/Confirm"
import { requestDeleteParagraph } from "../../apis/NoteApi"
import { toast } from "react-hot-toast"
import { ButtonGroup, Button, Popover } from "@kiwicom/orbit-components"
import { ChevronDown, ChevronUp, Edit } from "@kiwicom/orbit-components/icons"
import { FaTrash } from "react-icons/fa"


interface Props {
  paragraph: Paragraph
  onMoveUp: (seq: number) => void
  onMoveDown: (seq: number) => void
}

const NoteParagraphButtons: FC<Props> = ({paragraph, onMoveUp, onMoveDown}) => {
  const [opened, setOpened] = useState(false)
  const [fetching, deleteParagraph] = useDelete(paragraph)
  const [deleteConfirmShow, setDeleteConfirmShow] = useState(false)
  const history = useHistory()

  return (
    <Wrapper>
      <Popover
        preferredPosition="bottom"
        opened={opened}
        onClose={() => setOpened(false)}
        content={
          <ButtonWrapper>
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
                onClick={() => {
                  setOpened(false)
                  setDeleteConfirmShow(true)
                }}
                loading={fetching}
                type="secondary"
                size="small"
              >
                Delete
              </Button>
            </ButtonGroup>
          </ButtonWrapper>
        }
      >
        <Button
          iconLeft={<ChevronDown/>}
          type="white"
          onClick={() => setOpened(true)}
        />
      </Popover>
      <Confirm
        show={deleteConfirmShow}
        onOK={deleteParagraph}
        onClose={() => setDeleteConfirmShow(false)}
      >
        DELETE?
      </Confirm>
    </Wrapper>
  )
}

const useDelete = (paragraph: Paragraph): [boolean, () => void] => {
  const [fetching, setFetching] = useState(false)

  const deleteParagraph = () => {
    setFetching(true)
    requestDeleteParagraph(paragraph.noteID, paragraph.id)
      .then(() => window.location.reload())
      .catch(err => {
        toast.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, deleteParagraph]
}

const Wrapper = styled.div`
  float: right;
`

const ButtonWrapper = styled.div`
  button {
    display: inline-flex;
  }
`

export default NoteParagraphButtons
