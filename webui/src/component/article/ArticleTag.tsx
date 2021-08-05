import React, { FC } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { Tag } from "@kiwicom/orbit-components"


interface Props {
  tag: string
}

const ArticleTag: FC<Props> = ({ tag }) => (
  <StyledLink to={`/tags/${encodeURIComponent(tag)}`}>
    <Tag selected key={tag} size="small">{tag}</Tag>
  </StyledLink>
)

const StyledLink = styled(Link)`
  div[class*="Tag_"] {
    margin-right: 3px;
    margin-top: 5px;
    padding: 4px 6px;
  }
`

export default ArticleTag
