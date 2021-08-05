import React, { FC, useState } from "react"
import styled from "styled-components"
import Article from "../../models/Article"
import { Pagination as IPagination } from "../../common/Types"
import { requestDeleteArticles } from "../../apis/ArticleApi"
import ArticleListItem from "./ArticleListItem"
import { toast } from "react-hot-toast"
import { Button, Pagination } from "@kiwicom/orbit-components"


interface Props {
  articles: Article[]
  pagination: IPagination
  onSelectPage: (page: number) => void
}

const ArticleList: FC<Props> = ({articles, pagination, onSelectPage}) => {
  const [selectedIDs, select] = useSelectedIDs()
  const [fetching, deleteArticles] = useDeleteArticles()

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
      {
        selectedIDs.length <= 0 ?
          null :
          <DeleteBtnDiv>
            <Button
              type="criticalSubtle"
              size="small"
              loading={fetching}
              onClick={() => deleteArticles(selectedIDs)}
            >
              Delete
            </Button>
          </DeleteBtnDiv>
      }
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

const useSelectedIDs = (): [number[], (id: number, checked: boolean) => void] => {
  const [selectedIDs, setSelectedIDs] = useState([] as number[])

  const select = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIDs([...selectedIDs, id])
    } else {
      setSelectedIDs(selectedIDs.filter(selectedID => selectedID !== id))
    }
  }

  return [selectedIDs, select]
}

const useDeleteArticles = (): [boolean, (ids: number[]) => void] => {
  const [fetching, setFetching] = useState(false)

  const deleteArticles = (ids: number[]) => {
    if (ids.length <= 0) {
      return
    }

    setFetching(true)
    requestDeleteArticles(ids)
      .then(() => window.location.reload())
      .catch(err => {
        toast.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, deleteArticles]
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
