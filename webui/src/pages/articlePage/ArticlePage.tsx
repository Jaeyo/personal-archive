import React, { FC, useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useRequestGetArticle } from "../../apis/ArticleApi"
import ArticleTagTreeLayout from "../../component/layout/ArticleTagTreeLayout"
import ArticleTitle from "./ArticleTitle"
import ArticleTags from "./ArticleTags"
import ArticleLink from "./ArticleLink"
import ArticleContent from "./ArticleContent"


const ArticlePage: FC = () => {
  const {id} = useParams() as any
  const [fetching, getArticle, article, error] = useRequestGetArticle()
  const history = useHistory()

  useEffect(() => {
    getArticle(id)
  }, [ id, getArticle ])

  useEffect(() => {
    if (error && error.response?.status === 404) {
      setTimeout(() => history.push('/'), 1000)
    }
  }, [error, history])

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

export default ArticlePage
