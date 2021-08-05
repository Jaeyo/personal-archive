import React, { FC, useEffect, useState } from "react"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import { requestFindNoteTitles } from "../../apis/NoteApi"
import Note from "../../models/Note"
import { Loading } from "@kiwicom/orbit-components"
import NavItem from "../common/NavItem"
import { toast } from "react-hot-toast"


const NoteNav: FC = () => {
  const [fetching, notes] = useRequestFindNoteTitles()
  const history = useHistory()

  if (fetching) {
    return <Loading type="boxLoader" />
  }

  return (
    <WrapperDiv>
      {
        notes.map((note, i) => (
          <div key={i}>
            <NavItem role="button" onClick={() => history.push(`/notes/${note.id}`)}>
              {note.title}
            </NavItem>
          </div>
        ))
      }
    </WrapperDiv>
  )
}

const useRequestFindNoteTitles = (): [boolean, Note[]] => {
  const [fetching, setFetching] = useState(false)
  const [notes, setNotes] = useState([] as Note[])

  useEffect(() => {
    setFetching(true)
    requestFindNoteTitles()
      .then(notes => setNotes(notes))
      .catch(err => toast.error(err.toString()))
      .finally(() => setFetching(false))
  }, [])

  return [fetching, notes]
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

export default NoteNav
