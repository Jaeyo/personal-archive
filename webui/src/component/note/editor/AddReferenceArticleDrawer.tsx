import React, { FC, useState } from "react"
import { Alert, Button, Drawer, Icon, Input, InputGroup, List, Loader, Pagination } from "rsuite"
import { requestSearchArticles } from "../../../apis/ArticleApi"
import Article from "../../../models/Article"
import { emptyPagination } from "../../../common/Types"


interface Props {
  show: boolean
  onConfirm: (article: Article) => void
  onCancel: () => void
}

const AddReferenceArticleDrawer: FC<Props> = ({show, onConfirm, onCancel}) => {
  const [keyword, setKeyword] = useState('')
  const [fetching, setFetching] = useState(false)
  const [articles, setArticle] = useState([] as Article[])
  const [pagination, setPagination] = useState(emptyPagination)

  const onSearch = (page: number) => {
    setFetching(true)
    requestSearchArticles(keyword, page)
      .then(([articles, pagination]) => {
        setArticle(articles)
        setPagination(pagination)
      })
      .catch(err => Alert.error(err.toString()))
      .finally(() => setFetching(false))
  }

  const clear = () => {
    setKeyword('')
    setArticle([])
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

export default AddReferenceArticleDrawer
