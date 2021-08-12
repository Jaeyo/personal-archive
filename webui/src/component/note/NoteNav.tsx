import React, { FC, useEffect } from "react"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import { useRequestFindNoteTitles } from "../../apis/NoteApi"
import { Loading } from "@kiwicom/orbit-components"
import NavItem from "../common/NavItem"


const NoteNav: FC = () => {
  const [fetching, findNoteTitles, notes] = useRequestFindNoteTitles()
  const history = useHistory()

  useEffect(() => {
    findNoteTitles()
  }, [ findNoteTitles ])

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
