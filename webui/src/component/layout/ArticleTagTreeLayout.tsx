import React, { FC } from "react"
import ArticleTagTreeNav from "../article/ArticleTagTreeNav"
import MainLayout from "./MainLayout"
import { Loading } from "@kiwicom/orbit-components"


interface Props {
  loading?: boolean
  title?: string
}

const ArticleTagTreeLayout: FC<Props> = ({loading, title, children}) => (
  <MainLayout
    side={<ArticleTagTreeNav/>}
    title={title}
  >
    {loading ? <Loading type="boxLoader" /> : children}
  </MainLayout>
)

export default ArticleTagTreeLayout
