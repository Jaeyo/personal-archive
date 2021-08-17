import React, { FC, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useRequestGetArticle, useRequestGetArticleContent } from "../../apis/ArticleApi"
import ArticleTitle from "../articlePage/ArticleTitle"
import ArticleTags from "../articlePage/ArticleTags"
import ArticleLink from "../articlePage/ArticleLink"
import EditArticleContentMarkdownDesktop from "./EditArticleContentMarkdownDesktop"
import SimpleLayout from "../../component/layout/SimpleLayout"
import { Desktop, Mobile } from "@kiwicom/orbit-components"
import EditArticleContentMarkdownMobile from "./EditArticleContentMarkdownMobile"
import styled from "styled-components"


const EditArticlePage: FC = () => {
  const {id} = useParams() as any
  const [fetching, getArticle, article] = useRequestGetArticle()
  const [contentFetching, getContent, content] = useRequestGetArticleContent()

  useEffect(() => {
    getArticle(id)
    getContent(id)
  }, [ id, getArticle, getContent ])

  return (
    <SimpleLayout
      loading={fetching || contentFetching}
      title={article ? article.title : undefined}
    >
      {
        article && !contentFetching && (
          <>
            <ArticleTitle article={article!}/>
            <ArticleTags article={article!}/>
            <ArticleLink article={article!}/>
            <EditorWrapper>
              <Desktop>
                <EditArticleContentMarkdownDesktop articleID={id} content={content} />
              </Desktop>
              <Mobile>
                <EditArticleContentMarkdownMobile articleID={id} content={content} />
              </Mobile>
            </EditorWrapper>
          </>
        )
      }
    </SimpleLayout>
  )
}

const EditorWrapper = styled.div`
  div[class*="Hide_"] {  // Mobile 컴포넌트의 display 가 inline-block 으로 잡혀 iPad 사이즈에서 width 를 충분히 확보하지 못함
    width: 100%;
    // display: block;
  }
`

export default EditArticlePage
