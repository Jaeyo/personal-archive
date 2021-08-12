import React, { FC } from "react"
import { useHistory } from "react-router-dom"
import Note from "../../models/Note"
import { useRequestDeleteNote, useRequestUpdateTitle } from "../../apis/NoteApi"
import ManagedTitle from "../../component/common/ManagedTitle"


interface Props {
  note: Note
}

const NoteTitle: FC<Props> = ({note}) => {
  const [editFetching, updateTitle] = useRequestUpdateTitle()
  const [deleteFetching, deleteNote] = useRequestDeleteNote()
  const history = useHistory()

  const onEdit = (title: string) =>
    updateTitle(note.id, title)
      .then(() => window.location.reload())

  const onDelete = () =>
    deleteNote(note.id)
      .then(() => history.push('/notes'))

  return (
    <ManagedTitle
      title={note ? note.title : '...'}
      onEdit={onEdit}
      onDelete={onDelete}
      editFetching={editFetching}
      deleteFetching={deleteFetching}
    />
  )
}

export default NoteTitle
