import React, { FC } from "react"
import AddNote from "../../component/note/AddNote"
import NoteNavLayout from "../../component/layout/NoteNavLayout"


const NoteListPage: FC = () => (
  <NoteNavLayout>
    <AddNote />
  </NoteNavLayout>
)

export default NoteListPage
