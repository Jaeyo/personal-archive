import React, { FC } from "react"
import Article from "../../models/Article"
import { Checkbox, List } from "rsuite"
import ArticleTag from "./ArticleTag"
import TimeAgo from "javascript-time-ago"
import styled from "styled-components"
import { Link } from "react-router-dom"


interface Props {
  article: Article
  idx: number
  onSelect: (articleID: number, checked: boolean) => void
}

const ArticleListItem: FC<Props> = ({ article, idx, onSelect}) => (
  <List.Item key={article.id} index={idx}>
    <Checkbox onChange={(_: any, checked: boolean) => onSelect(article.id, checked)}>
      <ArticleLink to={`/articles/${article.id}`}>
        {article.title}
      </ArticleLink>
      {
        article.tags.map(
          ({tag}) => <ArticleTag tag={tag} key={tag}/>
        )
      }
      <MetaSpan>{getMetaText(article)}</MetaSpan>
    </Checkbox>
  </List.Item>
)

const getMetaText = (article: Article): string =>
  `${article.readingTime} / created ${new TimeAgo('en-us').format(article.created)}`

const ArticleLink = styled(Link)`
  margin-right: 15px;
`

const MetaSpan = styled.span`
  font-size: 11px;
  color: #999;
  margin-left: 10px;
  border-bottom: 1px dashed #ddd;
`


export default ArticleListItem
