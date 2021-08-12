import React, { FC, useState } from "react"
import Article from "../../../models/Article"
import { Button, Drawer, InputField, Loading, Pagination } from "@kiwicom/orbit-components"
import { FaSearch } from "react-icons/fa"
import { useRequestSearchArticles } from "../../../apis/ArticleApi"
import styled from "styled-components"


interface Props {
  show: boolean
  onConfirm: (article: Article) => void
  onCancel: () => void
}

const AddReferenceArticleDrawer: FC<Props> = ({show, onConfirm, onCancel}) => {
  const [keyword, setKeyword] = useState('')
  const [fetching, searchArticles, clear, articles, pagination] = useRequestSearchArticles()

  const onSearch = (page: number) => searchArticles(keyword, page)

  const onClear = () => {
    setKeyword('')
    clear()
  }

  const onClose = () => {
    onClear()
    onCancel()
  }

  const onSelect = (article: Article) => {
    onClear()
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
            <a href="#!" onClick={() => onSelect(article)}>
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

const ArticleWrapper = styled.div`
  padding: 10px 5px;
  border-bottom: 1px solid #eee;
  
  :hover {
    background-color: #eee;
  }
`

export default AddReferenceArticleDrawer
