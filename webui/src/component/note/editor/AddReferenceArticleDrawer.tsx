import React, { FC, useState } from "react"
import Article from "../../../models/Article"
import { emptyPagination, Pagination as PaginationType } from "../../../common/Types"
import { Button, Drawer, InputField, Loading, Pagination } from "@kiwicom/orbit-components"
import { FaSearch } from "react-icons/fa"
import { requestSearchArticles } from "../../../apis/ArticleApi"
import { toast } from "react-hot-toast"
import styled from "styled-components"


interface Props {
  show: boolean
  onConfirm: (article: Article) => void
  onCancel: () => void
}

const AddReferenceArticleDrawer: FC<Props> = ({show, onConfirm, onCancel}) => {
  const [keyword, setKeyword] = useState('')
  const [articles, setArticles] = useState([] as Article[])
  const [pagination, setPagination] = useState(emptyPagination)
  const [fetching, search] = useSearch()

  const onSearch = (page: number) =>
    search(keyword, page).then(({articles, pagination}) => {
      setArticles(articles)
      setPagination(pagination)
    })

  const clear = () => {
    setKeyword('')
    setArticles([])
    setPagination(emptyPagination)
  }

  const onClose = () => {
    clear()
    onCancel()
  }

  const onSelect = (article: Article) => {
    clear()
    onConfirm(article)
  }

  return (
    <Drawer shown={show} onClose={onClose} title="Add Article Reference">
      <InputField
        size="small"
        value={keyword}
        onChange={e => setKeyword((e.target as any).value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onSearch(1)
          }
        }}
        suffix={
          <span role="button" onClick={() => onSearch(1)} style={{marginRight: '10px'}}>
            <FaSearch/>
          </span>
        }
      />
      {fetching ? <Loading type="boxLoader"/> : null}
      {
        articles.map((article, i) => (
          <ArticleWrapper key={article.id}>
              <a href="#" onClick={() => onSelect(article)}>
                {article.title}
              </a>
          </ArticleWrapper>
        ))
      }
      <Pagination
        pageCount={pagination.totalPages}
        selectedPage={pagination.page}
        onPageChange={onSearch}
      />
      <div>
        <Button onClick={onClose} type="white">Close</Button>
      </div>
    </Drawer>
  )
}

type SearchResult = { articles: Article[], pagination: PaginationType }
type SearchFn = (keyword: string, page: number) => Promise<SearchResult>

const useSearch = (): [boolean, SearchFn] => {
  const [fetching, setFetching] = useState(false)

  const search = (keyword: string, page: number) => new Promise<SearchResult>((resolve, reject) => {
    setFetching(true)
    requestSearchArticles(keyword, page)
      .then(([articles, pagination]) => {
        resolve({articles, pagination})
      })
      .catch(err => toast.error(err.toString()))
      .finally(() => setFetching(false))
  })

  return [fetching, search]
}

const ArticleWrapper = styled.div`
  padding: 10px 5px;
  border-bottom: 1px solid #eee;
  
  :hover {
    background-color: #eee;
  }
`

export default AddReferenceArticleDrawer
