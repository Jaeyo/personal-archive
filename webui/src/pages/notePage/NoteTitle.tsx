import React, { FC, useState } from "react"
import { Alert } from "rsuite"
import { useHistory } from "react-router-dom"
import Note from "../../models/Note"
import { requestDeleteNote, requestUpdateTitle } from "../../apis/NoteApi"
import ManagedTitle from "../../component/common/ManagedTitle"
import { reloadAfterTick } from "../../common/Utils"


interface Props {
  note: Note
}

const NoteTitle: FC<Props> = ({note}) => {
  const [submitFetching, submit] = useSubmit(note.id)
  const [deleteFetching, deleteArticle] = useDelete(note.id)

  return (
    <ManagedTitle
      title={note ? note.title : '...'}
      onSubmit={submit}
      onDelete={deleteArticle}
      submitFetching={submitFetching}
      deleteFetching={deleteFetching}
    />
  )
}

const useSubmit = (noteID: number): [boolean, (title: string) => void] => {
  const [fetching, setFetching] = useState(false)

  const submit = (title: string) => {
    setFetching(true)
    requestUpdateTitle(noteID, title)
      .then(() => window.location.reload())
      .catch(err => {
        Alert.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, submit]
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
        Alert.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, deleteArticle]
}

export default NoteTitle
