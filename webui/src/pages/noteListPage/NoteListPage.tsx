import React, { FC } from "react"
import AddNote from "../../component/note/AddNote"
import NoteNavLayout from "../../component/layout/NoteNavLayout"
import CommandPalette from "./CommandPalette"


const NoteListPage: FC = () => (
  <NoteNavLayout>
    <AddNote />
    <CommandPalette />
  </NoteNavLayout>
)

export default NoteListPage
