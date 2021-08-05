import React, { FC, useState } from "react"
import { useHistory } from "react-router-dom"
import Note from "../../models/Note"
import { requestDeleteNote, requestUpdateTitle } from "../../apis/NoteApi"
import ManagedTitle from "../../component/common/ManagedTitle"
import { reloadAfterTick } from "../../common/Utils"
import { toast } from "react-hot-toast"


interface Props {
  note: Note
}

const NoteTitle: FC<Props> = ({note}) => {
  const [editFetching, edit] = useEdit(note.id)
  const [deleteFetching, deleteArticle] = useDelete(note.id)

  return (
    <ManagedTitle
      title={note ? note.title : '...'}
      onEdit={edit}
      onDelete={deleteArticle}
      editFetching={editFetching}
      deleteFetching={deleteFetching}
    />
  )
}

const useEdit = (noteID: number): [boolean, (title: string) => void] => {
  const [fetching, setFetching] = useState(false)

  const edit = (title: string) => {
    setFetching(true)
    requestUpdateTitle(noteID, title)
      .then(() => window.location.reload())
      .catch(err => {
        toast.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, edit]
}

const useDelete = (noteID: number): [boolean, () => void] => {
  const [fetching, setFetching] = useState(false)
  const history = useHistory()

  const deleteArticle = () => {
    setFetching(true)
    requestDeleteNote(noteID)
      .then(() => {
        if (history.length === 1) {
          history.push('/notes')
        } else {
          history.goBack()
          reloadAfterTick()
        }
      })
      .catch(err => {
        toast.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, deleteArticle]
}

export default NoteTitle
