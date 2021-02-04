import React, { FC } from "react"
import styled from "styled-components"
import { Button } from "rsuite"
import { useHistory } from "react-router-dom"
import NoteNav from "../../component/note/NoteNav"
import MainLayout from "../../component/layout/MainLayout"


const NoteListPage: FC = () => {
  const history = useHistory()

  return (
    <MainLayout>
      <NewButton
        appearance="primary"
        onClick={() => history.push('/notes/new')}
      >
        New Note
      </NewButton>
      <NoteNav />
    </MainLayout>
  )
}

const NewButton = styled(Button)`
  margin-bottom: 15px;
  margin-left: 45px;
  width: 200px;
`

export default NoteListPage
