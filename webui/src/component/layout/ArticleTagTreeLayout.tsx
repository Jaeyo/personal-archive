import React, { FC } from "react"
import ArticleTagTreeNav from "../article/ArticleTagTreeNav"
import MainLayout from "./MainLayout"
import { Loading } from "@kiwicom/orbit-components"


interface Props {
  loading?: boolean
}

const ArticleTagTreeLayout: FC<Props> = ({loading, children}) => (
  <MainLayout side={<ArticleTagTreeNav/>}>
    {loading ? <Loading type="boxLoader" /> : children}
  </MainLayout>
)

export default ArticleTagTreeLayout
