import React, { FC } from "react"
import styled from "styled-components"
import Article from "../../models/Article"
import { Link } from "@kiwicom/orbit-components/icons"


interface Props {
  article: Article
}

const ArticleLink: FC<Props> = ({article}) => (
  <div>
    <Link size="small"/>
    <LinkSpan>link: </LinkSpan>
    <UrlLink href={article.url} target="_blank" rel="noreferrer">{article.url}</UrlLink>
  </div>
)

const LinkSpan = styled.span`
  margin-left: 8px;
  margin-right: 8px;
  font-size: 13px;
`

const UrlLink = styled.a`
  word-break: break-all;
  font-size: 13px;
`

export default ArticleLink
