import React, { FC } from "react"
import { Button, Container, Loader, Sidebar } from "rsuite"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import BaseLayout from "./BaseLayout"
import NoteNav from "../note/NoteNav"


interface Props {
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const NoteNavLayout: FC<Props> = ({ loading, size = 'md', children }) => {
  const history = useHistory()

  return (
    <BaseLayout size={size}>
      <Sidebar width={260}>
        <Container>
          <NewButton onClick={() => history.push('/notes/new')}>
            New Note
          </NewButton>
          <NoteNav />
        </Container>
      </Sidebar>
      <StyledContent>
        {loading ? <Loader center/> : null}
        {children}
      </StyledContent>
    </BaseLayout>
  )
}

const StyledContent = styled(Container)`
  padding: 20px;
  margin-bottom: 200px;
`

const NewButton = styled(Button)`
  margin-bottom: 15px;
`

export default NoteNavLayout
