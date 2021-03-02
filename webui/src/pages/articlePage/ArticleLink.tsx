import React, { FC } from "react"
import styled from "styled-components"
import Article from "../../models/Article"
import { Icon } from "rsuite"


interface Props {
  article: Article
}

const ArticleLink: FC<Props> = ({article}) => (
  <div>
    <Icon icon="link"/>
    <LinkSpan>link: </LinkSpan>
    <UrlLink href={article.url} target="_blank" rel="noreferrer">{article.url}</UrlLink>
  </div>
)

const LinkSpan = styled.span`
  margin-left: 8px;
  margin-right: 4px;
`

const UrlLink = styled.a`
  word-break: break-all;
`

export default ArticleLink
