import React, { FC } from "react"
import styled from "styled-components"
import { Icon, IconButton } from "rsuite"
import { useHistory } from "react-router-dom"
import SimpleLayout from "../../component/layout/SimpleLayout"
import NoteNav from "../../component/note/NoteNav"


const NoteListPage: FC = () => {
  const history = useHistory()

  return (
    <SimpleLayout>
      <BtnDiv>
        <IconButton
          circle
          icon={<Icon icon="plus" />}
          onClick={() => history.push(`/notes/new`)}
        />
      </BtnDiv>
      <NoteNav />
    </SimpleLayout>
  )
}

const BtnDiv = styled.div`
  text-align: right;
`

export default NoteListPage
