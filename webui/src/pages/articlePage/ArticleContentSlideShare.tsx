import React, { FC } from "react"
import styled from "styled-components"


interface Props {
  content: string
}

const ArticleContentSlideShare: FC<Props> = ({ content }) => (
  <Wrapper dangerouslySetInnerHTML={{ __html: content }} />
)

const Wrapper = styled.div`
  margin: 15px 20px;
`

export default ArticleContentSlideShare
