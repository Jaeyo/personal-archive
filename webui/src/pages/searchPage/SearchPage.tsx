import React, { FC, useEffect, useState } from "react"
import styled from "styled-components"
import TagTreeLayout from "../../component/layout/TagTreeLayout"
import { usePage, useQuery } from "../../common/Hooks"
import { requestSearchArticles } from "../../apis/ArticleApi"
import { Alert } from "rsuite"
import Article from "../../models/Article"
import { emptyPagination } from "../../common/Types"
import ArticleList from "../../component/ArticleList"
import { useHistory } from "react-router-dom"


const SearchPage: FC = () => {
  const [fetching, setFetching] = useState(false)
  const [articles, setArticles] = useState([] as Article[])
  const [pagination, setPagination] = useState(emptyPagination)
  const keyword = useQuery().get('q') || ''
  const page = usePage()
  const history = useHistory()

  if (keyword.length <= 1) {
    Alert.error('keyword should be more than 2 characterS')
  }

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
      .catch(err => Alert.error(err.toString()))
      .finally(() => setFetching(false))
  }, [keyword, page])

  return (
    <TagTreeLayout loading={fetching}>
      <Keyword>Keyword: {keyword}</Keyword>
      <ArticleList
        articles={articles}
        pagination={pagination}
        onSelectPage={page => history.push(`/articles/search?q=${encodeURIComponent(keyword)}&page=${page}`)}
      />
    </TagTreeLayout>
  )
}

const Keyword = styled.h1`
  font-size: 24px;
`

export default SearchPage
