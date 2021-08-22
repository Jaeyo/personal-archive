import React, { FC } from "react"
import BaseCommandPalette from "../../component/etc/BaseCommandPalette"
import Note from "../../models/Note"
import { useHistory } from "react-router-dom"
import Paragraph from "../../models/Paragraph"
import { Command } from "react-command-palette"
import { History } from "history"
import { useRequestDeleteNote, useRequestDeleteParagraph, useRequestUpdateTitle } from "../../apis/NoteApi"
import { confirm } from "../../component/etc/GlobalConfirm"
import { prompt } from "../../component/etc/GlobalPrompt"


interface Props {
  note: Note
  onReload: () => void
}

const CommandPalette: FC<Props> = ({note, onReload}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, updateTitle] = useRequestUpdateTitle()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [__, deleteNote] = useRequestDeleteNote()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [___, deleteParagraph] = useRequestDeleteParagraph()
  const history = useHistory()

  const onEdit = () =>
    prompt({
      message: 'edit note title',
      initialValue: note.title,
      onOK: (newTitle: string) =>
        updateTitle(note.id, newTitle)
          .then(() => onReload())
    })

  const onDelete = () =>
    confirm({
      message: 'delete note?',
      onOK: () =>
        deleteNote(note.id)
          .then(() => history.push('/notes'))
    })

  return (
    <BaseCommandPalette
      commands={[
        {name: 'edit title', command: () => onEdit()},
        {name: 'delete note', command: () => onDelete()},
        ...getEditParagraphCommands(note.paragraphs, history),
        ...getDeleteParagraphCommands(note.paragraphs, deleteParagraph),
      ]}
    />
  )
}

const getEditParagraphCommands = (paragraphs: Paragraph[], history: History): Command[] =>
  paragraphs.map((paragraph, i) => ({
    name: `edit paragraph (${i + 1}: ${getParagraphSummary(paragraph.content)})`,
    command: () => history.push(`/notes/${paragraph.noteID}/paragraphs/${paragraph.id}/edit`),
  }))

const getDeleteParagraphCommands = (paragraphs: Paragraph[], deleteParagraph: (id: number, noteID: number) => Promise<void>): Command[] =>
  paragraphs.map((paragraph, i) => ({
    name: `delete paragraph (${i + 1}: ${getParagraphSummary(paragraph.content)})`,
    command: () => confirm({
      message: 'delete paragraph?',
      onOK: () => deleteParagraph(paragraph.id, paragraph.noteID)
    })
  }))

const getParagraphSummary = (content: string): string =>
  content.length < 10 ?
    content :
    content.substring(0, 10)

export default CommandPalette
