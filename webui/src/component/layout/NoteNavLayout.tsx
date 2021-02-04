import React, { FC } from "react"
import { Button, Container, Loader } from "rsuite"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import NoteNav from "../note/NoteNav"
import MainLayout from "./MainLayout"


interface Props {
  loading?: boolean
}

const NoteNavLayout: FC<Props> = ({ loading, children }) => {
  const history = useHistory()

  return (
    <MainLayout
      side={
        <>
          <NewButton
            appearance="primary"
            onClick={() => history.push('/notes/new')}
          >
            New Note
          </NewButton>
          <NoteNav />
        </>
      }
    >
      <StyledContent>
        {loading ? <Loader center/> : null}
        {children}
      </StyledContent>
    </MainLayout>
  )
}

const StyledContent = styled(Container)`
  padding: 20px;
  margin-bottom: 200px;
`

const NewButton = styled(Button)`
  margin-bottom: 15px;
  margin-left: 45px;
  width: 200px;
`

export default NoteNavLayout
