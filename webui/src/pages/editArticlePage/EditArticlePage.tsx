import React, { FC, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Article from "../../models/Article"
import { requestGetArticle } from "../../apis/ArticleApi"
import ArticleTitle from "../articlePage/ArticleTitle"
import ArticleTags from "../articlePage/ArticleTags"
import ArticleLink from "../articlePage/ArticleLink"
import EditArticleContentMarkdown from "./EditArticleContentMarkdown"
import SimpleLayout from "../../component/layout/SimpleLayout"
import { toast } from "react-hot-toast"


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
            <EditArticleContentMarkdown article={article}/>
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

export default EditArticlePage
