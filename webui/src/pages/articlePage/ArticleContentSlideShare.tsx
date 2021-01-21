import React, { FC } from "react"
import styled from "styled-components"
import Article from "../../models/Article"


interface Props {
  article: Article
}

const ArticleContentSlideShare: FC<Props> = ({ article }) => (
  <Wrapper dangerouslySetInnerHTML={{ __html: article.content }} />
)

const Wrapper = styled.div`
  margin: 15px 20px;
`

export default ArticleContentSlideShare
