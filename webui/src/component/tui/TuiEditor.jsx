import React, {useEffect, useRef} from "react"
import codeSyntaxHighlightPlugin from "@toast-ui/editor-plugin-code-syntax-highlight"
import hljs from "highlight.js"
import colorSyntaxPlugin from "@toast-ui/editor-plugin-color-syntax"
import {Editor} from "@toast-ui/react-editor"
import {useRequestGetEditorKeyboardHandler} from "../../apis/SettingApi"
import "highlight.js/styles/github.css"
import "codemirror/keymap/vim.js"
import "codemirror/lib/codemirror.css"
import "@toast-ui/editor/dist/toastui-editor.css"


// plugins hljs 를 넘기는 방식이 type 이 안맞게 넘겨야 해서 부득이하게 ts 가 아닌 js 로 작성
const TuiEditor = ({previewStyle = undefined, initialValue, height, onSubmit, keymaps = {}, onLoad}) => {
  // eslint-disable-next-line no-unused-vars
  const [_, getKeyboardHandler, keyboardHandler] = useRequestGetEditorKeyboardHandler()
  const editorRef = useRef()

  useEffect(() => {
    const editor = editorRef.current?.getInstance()
    if (!editor) {
      return
    }

    onLoad(editor)
    
    editor.focus()
    
    const cm = editor.getCodeMirror()
    const keymapsToAdd = Object.assign({}, keymaps, {
      'Ctrl-Enter': () => onSubmit(),
    })
    cm.addKeyMap(keymapsToAdd)

    getKeyboardHandler()
      .then(() => {
        if (keyboardHandler === 'vim') {
          cm.addKeyMap('vim')
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ getKeyboardHandler, keyboardHandler, onSubmit ])

  return (
    <Editor
      ref={editorRef}
      previewStyle={previewStyle}
      initialValue={initialValue}
      height={height}
      initialEditType="markdown"
      toolbarItems={[]}
      hideModeSwitch
      usageStatistics={false}
      plugins={[
        [codeSyntaxHighlightPlugin, {hljs}],
        colorSyntaxPlugin,
      ]}
    />
  )
}

export default TuiEditor
