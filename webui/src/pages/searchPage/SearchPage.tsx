import React, { FC, useEffect, useState } from "react"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import ArticleTagTreeLayout from "../../component/layout/ArticleTagTreeLayout"
import { usePage, useQuery } from "../../common/Hooks"
import { requestSearchArticles } from "../../apis/ArticleApi"
import Article from "../../models/Article"
import { emptyPagination, Pagination } from "../../common/Types"
import ArticleList from "../../component/article/ArticleList"
import { toast } from "react-hot-toast"


const SearchPage: FC = () => {
  const keyword = useQuery().get('q') || ''
  const page = usePage()
  const [ fetching, articles, pagination ] = useRequestSearchArticles(keyword, page)
  const history = useHistory()

  if (keyword.length <= 1) {
    toast.error('keyword should be more than 2 characters')
  }

  return (
    <ArticleTagTreeLayout loading={fetching}>
      <Keyword>Keyword: {keyword}</Keyword>
      <ArticleList
        articles={articles}
        pagination={pagination}
        onSelectPage={page => history.push(`/articles/search?q=${encodeURIComponent(keyword)}&page=${page}`)}
      />
    </ArticleTagTreeLayout>
  )
}

const useRequestSearchArticles = (keyword: string, page: number): [ boolean, Article[], Pagination ] => {
  const [fetching, setFetching] = useState(false)
  const [articles, setArticles] = useState([] as Article[])
  const [pagination, setPagination] = useState(emptyPagination)

  useEffect(() => {
    if (keyword.length <= 1) {
      return
    }

    setFetching(true)
    requestSearchArticles(keyword, page)
      .then(([articles, pagination]) => {
        setArticles(articles)
        setPagination(pagination)
      })
      .catch(err => toast.error(err.toString()))
      .finally(() => setFetching(false))
  }, [keyword, page])

  return [ fetching, articles, pagination ]
}

const Keyword = styled.h1`
  font-size: 24px;
`

export default SearchPage
