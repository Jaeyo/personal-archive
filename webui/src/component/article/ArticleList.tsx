import React, { FC, ReactElement, useState } from "react"
import styled from "styled-components"
import Article from "../../models/Article"
import { Pagination as IPagination } from "../../common/Types"
import { useRequestDeleteArticles } from "../../apis/ArticleApi"
import ArticleListItem from "./ArticleListItem"
import { Button, Pagination } from "@kiwicom/orbit-components"


interface Props {
  articles: Article[]
  pagination: IPagination
  onSelectPage: (page: number) => void
  onReload: () => void
}

const ArticleList: FC<Props> = ({articles, pagination, onSelectPage, onReload}) => {
  const [selectedIDs, select, renderDeleteBtn] = useSelectedIDs(onReload)

  return (
    <>
      {
        articles.map((article, i) => (
          <ArticleListItem
            article={article}
            isSelected={selectedIDs.indexOf(article.id) >= 0}
            onSelect={select}
            key={i}
          />
        ))
      }
      {renderDeleteBtn()}
      <PaginationDiv>
        <Pagination
          pageCount={pagination.totalPages}
          selectedPage={pagination.page}
          onPageChange={onSelectPage}
        />
      </PaginationDiv>
    </>
  )
}

const useSelectedIDs = (onReload: () => void): [
  number[],
  (id: number, checked: boolean) => void,
  () => ReactElement | null,
] => {
  const [selectedIDs, setSelectedIDs] = useState([] as number[])
  const [fetching, deleteArticles] = useRequestDeleteArticles()

  const select = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIDs([...selectedIDs, id])
    } else {
      setSelectedIDs(selectedIDs.filter(selectedID => selectedID !== id))
    }
  }

  const onDelete = () =>
    deleteArticles(selectedIDs)
      .then(() => onReload())

  const renderDeleteBtn = (): ReactElement | null =>
    selectedIDs.length > 0 ? (
      <DeleteBtnDiv>
        <Button
          type="criticalSubtle"
          size="small"
          loading={fetching}
          onClick={() => onDelete()}
        >
          Delete
        </Button>
      </DeleteBtnDiv>
    ) : null

  return [selectedIDs, select, renderDeleteBtn]
}

const DeleteBtnDiv = styled.div`
  text-align: right;
  margin-top: 15px;
  
  button {
    display: inline-flex;
  }
`

const PaginationDiv = styled.div`
  text-align: center;
  margin: 20px 0;
  
  div[class*="Stack_"] {
    display: inline-flex;
    width: inherit;
  }
`

export default ArticleList
