import React, { FC, useEffect, useState } from "react"
import styled from "styled-components"
import { History } from "history"
import { useHistory, useParams } from "react-router-dom"
import { Alert, Button } from "rsuite"
import { requestGetArticle } from "../../apis/ArticleApi"
import Article, { Kind } from "../../models/Article"
import BaseLayout from "../../component/layout/BaseLayout"
import ArticleTitle from "./ArticleTitle"
import ArticleTags from "./ArticleTags"
import ArticleLink from "./ArticleLink"
import ArticleContentTweet from "./ArticleContentTweet"
import ArticleMarkdownContent from "../../component/ArticleMarkdownContent"


const ArticlePage: FC = () => {
  const {id} = useParams() as any
  const [loadFetching, setLoadFetching] = useState(false)
  const [article, setArticle] = useState(null as Article | null)
  const history = useHistory()

  useEffect(() => {
    setLoadFetching(true)
    requestGetArticle(id)
      .then(article => {
        setArticle(article)
      })
      .finally(() => setLoadFetching(false))
      .catch(err => Alert.error(err.toString()))
  }, [id])

  return (
    <BaseLayout loading={loadFetching}>
      {renderArticle(article, history)}
    </BaseLayout>
  )
}

const renderArticle = (article: Article | null, history: History) => {
  if (!article) {
    return null
  }

  return (
    <>
      <ArticleTitle article={article}/>
      <ArticleTags article={article}/>
      <ArticleLink article={article}/>
      {renderContent(article, history)}
    </>
  )
}

const renderContent = (article: Article, history: History) => {
  if (article.kind === Kind.Tweet) {
    return <ArticleContentTweet article={article}/>
  }

  return (
    <>
      <EditBtnDiv>
        <Button
          appearance="link"
          onClick={() => history.push(`/articles/${article.id}/edit`)}
        >
          EDIT
        </Button>
      </EditBtnDiv>
      <ArticleMarkdownContent content={article.content} />
    </>
  )
}

export default ArticlePage

const EditBtnDiv = styled.div`
  text-align: right;
`
