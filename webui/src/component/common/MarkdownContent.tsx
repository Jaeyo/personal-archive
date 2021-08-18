import React, { FC } from "react"
import styled from "styled-components"
import TuiViewer from "../tui/TuiViewer"


interface Props {
  content: string
}

const MarkdownContent: FC<Props> = ({ content }) => (
  <MarkdownDiv>
    <TuiViewer initialValue={content} />
  </MarkdownDiv>
)

const MarkdownDiv = styled.div`
  blockquote {
    p {
      color: #222;
    }
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
      color: #222;
      font-size: 90%;
      padding: 2px 5px;
      font-style: normal;
      border-radius: 4px;
      border: 1px solid #cda982;
    }
  }
  
  code {
    padding: 2px 4px;
    font-size: 90%;
    color: #c7254e;
    background-color: #f9f2f4;
    border-radius: 4px;
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
      max-width: 70%;
    }
  }
`

export default MarkdownContent
