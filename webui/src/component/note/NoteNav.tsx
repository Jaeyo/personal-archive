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
    <WrapperDiv>
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
    </WrapperDiv>
  )
}

const WrapperDiv = styled.div`
  height: 100%;
  overflow-y: auto;
  
  // hide scroll bar for chrome, safari, opera
  ::-webkit-scrollbar {
    display: none;
  }
  // hide scroll bar for IE and edge
  -ms-overflow-style: none;
  // hide scroll bar for firefix
  scrollbar-width: none;
`

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
