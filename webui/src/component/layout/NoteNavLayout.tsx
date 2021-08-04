import React, { FC } from "react"
import NoteNav from "../note/NoteNav"
import MainLayout from "./MainLayout"
import { Loading } from "@kiwicom/orbit-components"


interface Props {
  loading?: boolean
}

const NoteNavLayout: FC<Props> = ({ loading, children }) => (
  <MainLayout side={<NoteNav />}>
    {loading ? <Loading type="boxLoader"/> : children}
  </MainLayout>
)

export default NoteNavLayout
