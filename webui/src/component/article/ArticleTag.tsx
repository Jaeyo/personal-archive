import React, { FC } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { Tag } from "rsuite"


interface Props {
  tag: string
}

const ArticleTag: FC<Props> = ({ tag }) => (
  <Link to={`/tags/${encodeURIComponent(tag)}`}>
    <StyledTag color="red" key={tag}>{tag}</StyledTag>
  </Link>
)

const StyledTag = styled(Tag)`
  margin-right: 3px;
`

export default ArticleTag
