import React, { FC, useEffect } from "react"
import Article, { Kind } from "../../models/Article"
import ArticleContentTweet from "./ArticleContentTweet"
import ArticleContentSlideShare from "./ArticleContentSlideShare"
import ArticleContentYoutube from "./ArticleContentYoutube"
import { useHistory } from "react-router-dom"
import MarkdownContent from "../../component/common/MarkdownContent"
import { Button, Loading } from "@kiwicom/orbit-components"
import styled from "styled-components"
import { useRequestGetArticleContent } from "../../apis/ArticleApi"


interface Props {
  article: Article
}

const ArticleContent: FC<Props> = ({article}) => {
  const [fetching, getContent, content] = useRequestGetArticleContent()
  const history = useHistory()

  useEffect(() => {
    getContent(article.id)
  }, [ article, getContent ])

  if (fetching) {
    return <Loading type="boxLoader" />
  }

  return article.kind === Kind.Tweet ?
    <ArticleContentTweet content={content} /> :
    article.kind === Kind.SlideShare ?
      <ArticleContentSlideShare content={content} /> :
      article.kind === Kind.Youtube ?
        <ArticleContentYoutube content={content} /> :
        <>
          <EditButtonWrapper>
            <Button
              type="white"
              onClick={() => history.push(`/articles/${article.id}/edit`)}
            >
              EDIT
            </Button>
          </EditButtonWrapper>
          <MarkdownContent content={content}/>
        </>
}

const EditButtonWrapper = styled.div`
  text-align: right;
  button {
    display: inline-flex;
  }
`

export default ArticleContent
