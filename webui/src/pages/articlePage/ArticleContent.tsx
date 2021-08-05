import React, { FC } from "react"
import Article, { Kind } from "../../models/Article"
import ArticleContentTweet from "./ArticleContentTweet"
import ArticleContentSlideShare from "./ArticleContentSlideShare"
import ArticleContentYoutube from "./ArticleContentYoutube"
import { useHistory } from "react-router-dom"
import MarkdownContent from "../../component/common/MarkdownContent"
import { Button } from "@kiwicom/orbit-components"
import styled from "styled-components"


interface Props {
  article: Article
}

const ArticleContent: FC<Props> = ({article}) => {
  const history = useHistory()

  return article.kind === Kind.Tweet ?
    <ArticleContentTweet article={article}/> :
    article.kind === Kind.SlideShare ?
      <ArticleContentSlideShare article={article}/> :
      article.kind === Kind.Youtube ?
        <ArticleContentYoutube article={article}/> :
        <>
          <EditButtonWrapper>
            <Button
              type="white"
              onClick={() => history.push(`/articles/${article.id}/edit`)}
            >
              EDIT
            </Button>
          </EditButtonWrapper>
          <MarkdownContent content={article.content}/>
        </>
}

const EditButtonWrapper = styled.div`
  text-align: right;
  button {
    display: inline-flex;
  }
`

export default ArticleContent
