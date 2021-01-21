import React, { FC, useEffect, useState } from "react"
import styled from "styled-components"
import { History } from "history"
import { useHistory, useParams } from "react-router-dom"
import { Alert, Button } from "rsuite"
import { requestGetArticle } from "../../apis/ArticleApi"
import Article, { Kind } from "../../models/Article"
import TagTreeLayout from "../../component/layout/TagTreeLayout"
import ArticleTitle from "./ArticleTitle"
import ArticleTags from "./ArticleTags"
import ArticleLink from "./ArticleLink"
import ArticleContentTweet from "./ArticleContentTweet"
import ArticleMarkdownContent from "../../component/ArticleMarkdownContent"
import ArticleContentSlideShare from "./ArticleContentSlideShare"
import ArticleContentYoutube from "./ArticleContentYoutube"


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
      .catch(err => {
        Alert.error(err.toString())
        if (err.response?.status === 404) {
          setTimeout(() => history.push('/'), 1000)
        }
      })
  }, [id, history])

  return (
    <TagTreeLayout loading={loadFetching}>
      {renderArticle(article, history)}
    </TagTreeLayout>
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
  } else if (article.kind === Kind.SlideShare) {
    return <ArticleContentSlideShare article={article}/>
  } else if (article.kind === Kind.Youtube) {
    return <ArticleContentYoutube article={article}/>
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
