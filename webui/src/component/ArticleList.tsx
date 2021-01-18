import React, { FC } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import Article from "../models/Article"
import { List, Pagination } from "rsuite"
import ArticleTag from "./ArticleTag"
import { Pagination as IPagination } from "../common/Types"


interface Props {
  articles: Article[]
  pagination: IPagination
  onSelectPage: (page: number) => void
}

const ArticleList: FC<Props> = ({articles, pagination, onSelectPage}) => (
  <>
    <List>
      {
        articles.map((article, i) => (
          <List.Item key={article.id} index={i}>
            <ArticleLink to={`/articles/${article.id}`}>
              {article.title}
            </ArticleLink>
            {
              article.tags.map(
                ({tag}) => <ArticleTag tag={tag} key={tag}/>
              )
            }
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

const ArticleLink = styled(Link)`
  margin-right: 15px;
`

const PaginationDiv = styled.div`
  text-align: center;
  margin: 20px 0;
`

export default ArticleList
