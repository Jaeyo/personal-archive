import React, { FC, useEffect, useState } from "react"
import { History } from "history"
import { useHistory, useParams } from "react-router-dom"
import { Alert } from "rsuite"
import { requestGetArticle } from "../../apis/ArticleApi"
import Article from "../../models/Article"
import ArticleTagTreeLayout from "../../component/layout/ArticleTagTreeLayout"
import ArticleTitle from "./ArticleTitle"
import ArticleTags from "./ArticleTags"
import ArticleLink from "./ArticleLink"
import ArticleContent from "./ArticleContent"


const ArticlePage: FC = () => {
  const {id} = useParams() as any
  const [fetching, setFetching] = useState(false)
  const [article, setArticle] = useState(null as Article | null)
  const history = useHistory()

  useEffect(() => {
    setFetching(true)
    requestGetArticle(id)
      .then(article => {
        setArticle(article)
      })
      .finally(() => setFetching(false))
      .catch(err => {
        Alert.error(err.toString())
        if (err.response?.status === 404) {
          setTimeout(() => history.push('/'), 1000)
        }
      })
  }, [id, history])

  return (
    <ArticleTagTreeLayout loading={fetching}>
      {renderArticle(article, history)}
    </ArticleTagTreeLayout>
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
      <ArticleContent article={article} />
    </>
  )
}

export default ArticlePage
