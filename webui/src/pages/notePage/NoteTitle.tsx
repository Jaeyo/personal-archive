import React, { FC } from "react"
import { useHistory } from "react-router-dom"
import Note from "../../models/Note"
import ManagedTitle from "../../component/common/ManagedTitle"
import { useRequestDeleteNote, useRequestUpdateTitle } from "../../apis/NoteApi"
import { confirm } from "../../component/etc/GlobalConfirm"
import { prompt } from "../../component/etc/GlobalPrompt"


interface Props {
  note: Note
  onReload: () => void
}

const NoteTitle: FC<Props> = ({note, onReload}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, updateTitle] = useRequestUpdateTitle()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [__, deleteNote] = useRequestDeleteNote()
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
    <ManagedTitle
      title={note.title}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  )
}

export default NoteTitle
