import React, { FC, useState } from "react"
import { Alert, Button, Drawer, Icon, Input, InputGroup, List, Loader, Pagination } from "rsuite"
import { requestSearchArticles } from "../../../apis/ArticleApi"
import Article from "../../../models/Article"
import { emptyPagination, Pagination as PaginationType } from "../../../common/Types"


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
    <Drawer show={show} onHide={onClose}>
      <Drawer.Header>
        <Drawer.Title>Add Article Reference</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <InputGroup>
          <Input value={keyword} onChange={setKeyword} placeholder="keyword" onPressEnter={() => onSearch(1)}/>
          <InputGroup.Button onClick={() => onSearch(1)}>
            <Icon icon="search"/>
          </InputGroup.Button>
        </InputGroup>
        {fetching ? <Loader/> : null}
        <List>
          {
            articles.map((article, i) => (
              <List.Item key={article.id} index={i}>
                <a href="#!" onClick={() => onSelect(article)}>
                  {article.title}
                </a>
              </List.Item>
            ))
          }
        </List>
        <Pagination
          activePage={pagination.page}
          pages={pagination.totalPages}
          prev
          next
          onSelect={onSearch}
        />
      </Drawer.Body>
      <Drawer.Footer>
        <Button onClick={onClose} appearance="subtle">Close</Button>
      </Drawer.Footer>
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
      .catch(err => Alert.error(err.toString()))
      .finally(() => setFetching(false))
  })

  return [fetching, search]
}

export default AddReferenceArticleDrawer
