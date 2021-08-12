import React, { FC } from "react"
import Article from "../../models/Article"
import ArticleTag from "./ArticleTag"
import TimeAgo from "javascript-time-ago"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { Checkbox } from "@kiwicom/orbit-components"


interface Props {
  article: Article
  isSelected: boolean
  onSelect: (articleID: number, checked: boolean) => void
}

const ArticleListItem: FC<Props> = ({ article, isSelected, onSelect}) => (
  <Wrapper>
    <Header>
      <Checkbox
        checked={isSelected}
        onChange={() => onSelect(article.id, !isSelected)}
      />
    </Header>
    <Main>
      <ArticleLink to={`/articles/${article.id}`}>
        {article.title}
      </ArticleLink>
      {
        article.tags.map(
          ({tag}) => <ArticleTag tag={tag} key={tag}/>
        )
      }
      <MetaSpan>{getMetaText(article)}</MetaSpan>
    </Main>
  </Wrapper>
)

const getMetaText = (article: Article): string =>
  `created ${new TimeAgo('en-us').format(article.created)}`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
 
  padding: 10px 5px;
  border-bottom: 1px solid #eee;
  
  :hover {
    background-color: #eee;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
`

const Main = styled.div`
  /* Take the remaining height */
  flex-grow: 1;
`

const ArticleLink = styled(Link)`
  margin-right: 15px;
  color: #333;
  font-size: 13px;
  text-decoration: none;
  
  display: inline-block;
  margin-top: 10px;
`

const MetaSpan = styled.span`
  font-size: 11px;
  color: #999;
  margin-left: 10px;
  border-bottom: 1px dashed #ddd;
`

export default ArticleListItem
