import React, { FC, useEffect } from "react"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import ArticleTagTreeLayout from "../../component/layout/ArticleTagTreeLayout"
import { usePage, useQuery } from "../../common/Hooks"
import { useRequestSearchArticles } from "../../apis/ArticleApi"
import ArticleList from "../../component/article/ArticleList"
import { toast } from "react-hot-toast"


const SearchPage: FC = () => {
  const keyword = useQuery().get('q') || ''
  const page = usePage()
  const [ fetching, searchArticles, _, articles, pagination] = useRequestSearchArticles()
  const history = useHistory()

  useEffect(() => {
    if (keyword.length <= 1) {
      toast.error('keyword should be more than 2 characters')
      return
    }

    searchArticles(keyword, page)
  }, [keyword, page, searchArticles])


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

const Keyword = styled.h1`
  font-size: 24px;
`

export default SearchPage
