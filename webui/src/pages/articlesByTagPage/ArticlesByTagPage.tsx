import React, { FC, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Alert } from "rsuite"
import { requestFindArticlesByTag } from "../../apis/ArticleApi"
import ArticleTagTreeLayout from "../../component/layout/ArticleTagTreeLayout"
import Article from "../../models/Article"
import TagTitle from "./TagTitle"
import { usePage } from "../../common/Hooks"
import { emptyPagination } from "../../common/Types"
import ArticleList from "../../component/ArticleList"


const ArticlesByTagPage: FC = () => {
  const tag = decodeURIComponent((useParams() as any).tag)
  const page = usePage()
  const [fetching, setFetching] = useState(false)
  const [articles, setArticles] = useState([] as Article[])
  const [pagination, setPagination] = useState(emptyPagination)
  const history = useHistory()

  useEffect(() => {
    setFetching(true)
    requestFindArticlesByTag(tag, page)
      .then(([articles, pagination]) => {
        setArticles(articles)
        setPagination(pagination)
      })
      .finally(() => setFetching(false))
      .catch(err => Alert.error(err.toString()))
  }, [tag, page])

  return (
    <ArticleTagTreeLayout loading={fetching}>
      <TagTitle tag={tag}/>
      <ArticleList
        articles={articles}
        pagination={pagination}
        onSelectPage={page => history.push(`/tags/${tag}?page=${page}`)}
      />
    </ArticleTagTreeLayout>
  )
}

export default ArticlesByTagPage
