import React from "react"
import {Viewer} from "@toast-ui/react-editor";
import codeSyntaxHighlightPlugin from "@toast-ui/editor-plugin-code-syntax-highlight";
import hljs from "highlight.js";
import colorSyntaxPlugin from "@toast-ui/editor-plugin-color-syntax";
import "highlight.js/styles/github.css"


// plugins hljs 를 넘기는 방식이 type 이 안맞게 넘겨야 해서 부득이하게 ts 가 아닌 js 로 작성
const TuiViewer = ({ initialValue }) => {
  return (
    <Viewer
      initialValue={initialValue}
      plugins={[
        [codeSyntaxHighlightPlugin, {hljs}],
        colorSyntaxPlugin,
      ]}
    />
  )
}

export default TuiViewer
