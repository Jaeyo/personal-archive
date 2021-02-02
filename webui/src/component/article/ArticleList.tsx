import React, { FC, useState } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import Article from "../../models/Article"
import { Alert, Button, Checkbox, List, Pagination } from "rsuite"
import ArticleTag from "./ArticleTag"
import { Pagination as IPagination } from "../../common/Types"
import { requestDeleteArticles } from "../../apis/ArticleApi"


interface Props {
  articles: Article[]
  pagination: IPagination
  onSelectPage: (page: number) => void
}

const ArticleList: FC<Props> = ({articles, pagination, onSelectPage}) => {
  const [ selectedIDs, setSelectedIDs ] = useState([] as number[])
  const [ deleteFetching, setDeleteFetching ] = useState(false)

  const onChecked = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIDs([ ...selectedIDs, id ])
    } else {
      setSelectedIDs(selectedIDs.filter(selectedID => selectedID !== id))
    }
  }

  const onDelete = () => {
    if (selectedIDs.length <= 0) {
      return
    }

    setDeleteFetching(true)
    requestDeleteArticles(selectedIDs)
      .then(() => window.location.reload())
      .catch(err => {
        Alert.error(err.toString())
        setDeleteFetching(false)
      })
  }

  return (
    <>
      {
        selectedIDs.length <= 0 ?
          null :
          <DeleteBtnDiv>
            <DeleteBtn
              color="red"
              loading={deleteFetching}
              onClick={onDelete}
            >
              Delete
            </DeleteBtn>
          </DeleteBtnDiv>
      }
      <List hover>
        {
          articles.map((article, i) => (
            <List.Item key={article.id} index={i}>
              <Checkbox onChange={(_: any, checked: boolean) => onChecked(article.id, checked)}>
                <ArticleLink to={`/articles/${article.id}`}>
                  {article.title}
                </ArticleLink>
                {
                  article.tags.map(
                    ({tag}) => <ArticleTag tag={tag} key={tag}/>
                  )
                }
                <ReadingTimeSpan>{article.readingTime}</ReadingTimeSpan>
              </Checkbox>
            </List.Item>
          ))
        }
      </List>
      <PaginationDiv>
        <Pagination
          activePage={pagination.page}
          pages={pagination.totalPages}
          prev
          next
          onSelect={onSelectPage}
        />
      </PaginationDiv>
    </>
  )
}

const DeleteBtnDiv = styled.div`
  text-align: right;
  margin-bottom: 15px;
`

const DeleteBtn = styled(Button)`
  width: 100px;
`

const ArticleLink = styled(Link)`
  margin-right: 15px;
`

const PaginationDiv = styled.div`
  text-align: center;
  margin: 20px 0;
`

const ReadingTimeSpan = styled.span`
  font-size: 11px;
  color: #999;
  margin-left: 10px;
  border-bottom: 1px dashed #ddd;
`

export default ArticleList
