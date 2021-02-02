import React, { FC, useState } from "react"
import { Alert } from "rsuite"
import { useHistory } from "react-router-dom"
import Note from "../../models/Note"
import { requestDeleteNote, requestUpdateTitle } from "../../apis/NoteApi"
import ManagedTitle from "../../component/common/ManagedTitle"
import { reloadAfterTick } from "../../common/Utils"


interface Props {
  note: Note | null
}

const NoteTitle: FC<Props> = ({ note }) => {
  const [submitFetching, setSubmitFetching] = useState(false)
  const [deleteFetching, setDeleteFetching] = useState(false)
  const history = useHistory()

  const onSubmit = (title: string) => {
    setSubmitFetching(true)
    requestUpdateTitle(note!.id, title)
      .then(() => window.location.reload())
      .catch(err => {
        Alert.error(err.toString())
        setSubmitFetching(false)
      })
  }

  const onDelete = () => {
    setDeleteFetching(true)
    requestDeleteNote(note!.id)
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
        setDeleteFetching(false)
      })
  }

  return (
    <ManagedTitle
      title={note ? note.title : '...'}
      onSubmit={onSubmit}
      onDelete={onDelete}
      submitFetching={submitFetching}
      deleteFetching={deleteFetching}
    />
  )
}

export default NoteTitle
