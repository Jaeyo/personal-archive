import React, { FC, useEffect, useState } from "react"
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
  const [fetching, article] = useRequestGetArticle(id)

  return (
    <ArticleTagTreeLayout loading={fetching}>
      {
        article && (
          <>
            <ArticleTitle article={article}/>
            <ArticleTags article={article}/>
            <ArticleLink article={article}/>
            <ArticleContent article={article}/>
          </>
        )
      }
    </ArticleTagTreeLayout>
  )
}

const useRequestGetArticle = (id: number): [boolean, Article | null] => {
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

  return [fetching, article]
}

export default ArticlePage
