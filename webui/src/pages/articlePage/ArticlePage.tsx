import React, { FC, useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useRequestGetArticle } from "../../apis/ArticleApi"
import ArticleTagTreeLayout from "../../component/layout/ArticleTagTreeLayout"
import ArticleTitle from "./ArticleTitle"
import ArticleTags from "./ArticleTags"
import ArticleLink from "./ArticleLink"
import ArticleContent from "./ArticleContent"
import CommandPalette from "./CommandPalette"


const ArticlePage: FC = () => {
  const {id} = useParams() as any
  const [fetching, getArticle, article, error] = useRequestGetArticle()
  const history = useHistory()

  useEffect(() => {
    getArticle(id)
  }, [id, getArticle])

  useEffect(() => {
    if (error && error.response?.status === 404) {
      setTimeout(() => history.push('/'), 1000)
    }
  }, [error, history])

  const onReload = () => getArticle(id)

  return (
    <ArticleTagTreeLayout
      loading={fetching}
      title={article ? article.title : undefined}
    >
      {
        article && (
          <>
            <ArticleTitle article={article} onReload={onReload}/>
            <ArticleTags article={article} onReload={onReload}/>
            <ArticleLink article={article}/>
            <ArticleContent article={article}/>
            <CommandPalette article={article} onReload={onReload}/>
          </>
        )
      }
    </ArticleTagTreeLayout>
  )
}

export default ArticlePage
