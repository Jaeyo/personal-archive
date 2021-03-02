import React, { FC, useState } from "react"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import Paragraph from "../../models/Paragraph"
import { Alert, Button, Icon, IconButton, Popover, Whisper } from "rsuite"
import Confirm from "../../component/common/Confirm"
import { requestDeleteParagraph } from "../../apis/NoteApi"


interface Props {
  paragraph: Paragraph
  onMoveUp: (seq: number) => void
  onMoveDown: (seq: number) => void
}

const NoteParagraphButtons: FC<Props> = ({paragraph, onMoveUp, onMoveDown}) => {
  const [fetching, deleteParagraph] = useDelete(paragraph)
  const [deleteConfirmShow, setDeleteConfirmShow] = useState(false)
  const history = useHistory()

  return (
    <Wrapper>
      <Whisper
        placement="bottomEnd"
        trigger="hover"
        enterable
        speaker={
          <Popover>
            <IconButton
              icon={<Icon icon="chevron-up"/>}
              onClick={() => onMoveUp(paragraph.seq)}
              size="xs"
            />
            &nbsp;
            <IconButton
              icon={<Icon icon="chevron-down"/>}
              onClick={() => onMoveDown(paragraph.seq)}
              size="xs"
            />
            &nbsp;
            <IconButton
              icon={<Icon icon="edit"/>}
              onClick={() => history.push(`/notes/${paragraph.noteID}/paragraphs/${paragraph.id}/edit`)}
              size="xs"
            />
            &nbsp;
            <IconButton
              loading={fetching}
              icon={<Icon icon={"trash"}/>}
              onClick={() => setDeleteConfirmShow(true)}
              size="xs"
            />
            <Confirm
              show={deleteConfirmShow}
              onOK={deleteParagraph}
              onClose={() => setDeleteConfirmShow(false)}
            >
              DELETE?
            </Confirm>
          </Popover>
        }
      >
        <IconButton
          icon={<Icon icon="chevron-down" />}
          circle
          appearance="link"
        />
      </Whisper>
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
        Alert.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, deleteParagraph]
}

const Wrapper = styled.div`
  float: right;
`

export default NoteParagraphButtons
