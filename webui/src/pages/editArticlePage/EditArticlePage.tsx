import React, { FC, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Article from "../../models/Article"
import { requestGetArticle } from "../../apis/ArticleApi"
import ArticleTitle from "../articlePage/ArticleTitle"
import ArticleTags from "../articlePage/ArticleTags"
import ArticleLink from "../articlePage/ArticleLink"
import EditArticleContentMarkdownDesktop from "./EditArticleContentMarkdownDesktop"
import SimpleLayout from "../../component/layout/SimpleLayout"
import { toast } from "react-hot-toast"
import { Desktop, Mobile } from "@kiwicom/orbit-components"
import EditArticleContentMarkdownMobile from "./EditArticleContentMarkdownMobile"
import styled from "styled-components"


const EditArticlePage: FC = () => {
  const {id} = useParams() as any
  const [fetching, article] = useRequestGetArticle(id)

  return (
    <SimpleLayout loading={fetching}>
      {
        article && (
          <>
            <ArticleTitle article={article}/>
            <ArticleTags article={article}/>
            <ArticleLink article={article}/>
            <EditorWrapper>
              <Desktop>
                <EditArticleContentMarkdownDesktop article={article} />
              </Desktop>
              <Mobile>
                <EditArticleContentMarkdownMobile article={article} />
              </Mobile>
            </EditorWrapper>
          </>
        )
      }
    </SimpleLayout>
  )
}

const useRequestGetArticle = (id: number): [boolean, Article | null] => {
  const [fetching, setFetching] = useState(false)
  const [article, setArticle] = useState(null as Article | null)

  useEffect(() => {
    setFetching(true)
    requestGetArticle(id)
      .then(article => {
        setArticle(article)
      })
      .finally(() => setFetching(false))
      .catch(err => toast.error(err.toString()))
  }, [id])

  return [fetching, article]
}

const EditorWrapper = styled.div`
  div[class*="Hide_"] {  // Mobile 컴포넌트의 display 가 inline-block 으로 잡혀 iPad 사이즈에서 width 를 충분히 확보하지 못함
    width: 100%;
    // display: block;
  }
`

export default EditArticlePage
