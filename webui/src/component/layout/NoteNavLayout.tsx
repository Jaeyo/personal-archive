import React, { FC } from "react"
import NoteNav from "../note/NoteNav"
import MainLayout from "./MainLayout"
import { Loading } from "@kiwicom/orbit-components"


interface Props {
  loading?: boolean
  title?: string
}

const NoteNavLayout: FC<Props> = ({ loading, title, children }) => (
  <MainLayout
    side={<NoteNav />}
    title={title}
  >
    {loading ? <Loading type="boxLoader"/> : children}
  </MainLayout>
)

export default NoteNavLayout
