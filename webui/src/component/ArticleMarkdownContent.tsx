import React, { FC } from "react"
import styled from "styled-components"
import ReactMarkdown from "react-markdown"


interface Props {
  content: string
}

const ArticleMarkdownContent: FC<Props> = ({ content }) => (
  <MarkdownDiv>
    <ReactMarkdown>
      {content}
    </ReactMarkdown>
  </MarkdownDiv>
)

const MarkdownDiv = styled.div`
  h1 {
    font-size: 26px;
    margin: 1em 0;
    border-bottom: 1px solid #eaecef;
  }
  h1:before {
    content:"# ";
  }
  h2 {
    font-size: 22px;
    margin: 1em 0;
    border-bottom: 1px solid #eaecef;
  }
  h2:before {
    content:"## ";
  }
  h3 {
    font-size: 18px;
    margin: 0.8em 0;
    border-bottom: 1px solid #eaecef;
  }
  h3:before {
    content:"### ";
  }
  h4 {
    font-size: 16px;
    margin: 0.7em 0;
  }
  h4:before {
    content:"#### ";
  }
  h5 {
    font-size: 15px;
    margin: 0.7em 0;
  }
  h5:before {
    content:"##### ";
  }
  h6 {
    font-size: 14px;
    margin: 0.7em 0;
  }
  h6:before {
    content:"###### ";
  }
  
  blockquote {
    padding: 1px 18px;
    margin: 3px 0;
    border-left: 3px solid #888;
    white-space: pre-line;
  }
  
  p {
    margin: 0.5em 0;
  }
  
  img {
    max-width: 60%;
  }
  
  pre {
    background-color: #f2f2f2;
    padding: 9px;
    white-space: pre-line;
  }
`

export default ArticleMarkdownContent
