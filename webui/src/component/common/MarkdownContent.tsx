import React, { FC } from "react"
import styled from "styled-components"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter"
import {nord} from "react-syntax-highlighter/dist/esm/styles/prism"


interface Props {
  content: string
}

const renderers = {
  code: ({language, value}: any) => <SyntaxHighlighter style={nord} language={language} children={value} />
}

const MarkdownContent: FC<Props> = ({ content }) => (
  <MarkdownDiv>
    <ReactMarkdown
      renderers={renderers}
      plugins={[
        remarkGfm,
        remarkBreaks,
      ]}
      children={content}
    />
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
    line-height: 1.7;
  }
  
  pre {
    background-color: #f2f2f2;
    padding: 9px;
    white-space: pre-line;
  }
  
  em {
    strong {
      background-color: #F2E39B;
      padding: 2px 5px;
      font-style: normal;
    }
  }
  
  // mobile
  @media (max-width: 768px) {
    img {
      max-width: 100%;
    }
  }
  
  // desktop 
  @media (min-width: 769px) {
    img {
      max-width: 60%;
    }
  }
`

export default MarkdownContent
