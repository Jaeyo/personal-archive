import React, { FC, useEffect, useState } from "react"
import styled from "styled-components"
import { Alert, Loader } from "rsuite"
import { useHistory } from "react-router-dom"
import { requestFindNoteTitles } from "../../apis/NoteApi"
import Note from "../../models/Note"


const NoteNav: FC = () => {
  const [fetching, setFetching] = useState(false)
  const [notes, setNotes] = useState([] as Note[])
  const history = useHistory()

  useEffect(() => {
    setFetching(true)
    requestFindNoteTitles()
      .then(notes => setNotes(notes))
      .catch(err => Alert.error(err.toString()))
      .finally(() => setFetching(false))
  }, [])

  return (
    <>
      { fetching ? <Loader /> : null }
      {
        notes.map((note, i) => (
          <NoteDiv key={note.id}>
            <NoteOuterSpan>
              <NoteInnerSpan role="button" onClick={() => history.push(`/notes/${note.id}`)}>
                {note.title}
              </NoteInnerSpan>
            </NoteOuterSpan>
          </NoteDiv>
        ))
      }
    </>
  )
}

const NoteDiv = styled.div`
  padding: 3px 12px;
`

const NoteOuterSpan = styled.span`
  padding: 6px;
  display: inline-block;
  
  :hover {
    background-color: #eee;
  }
`

const NoteInnerSpan = styled.span`
  cursor: pointer;
  padding: 2px;
  border-bottom: 1px dashed #ddd;
`

export default NoteNav
