import React, { FC, useCallback, useEffect, useRef } from "react"
import { Button, useMediaQuery } from "@kiwicom/orbit-components"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import { useRequestUpdateContent } from "../../apis/ArticleApi"
import { Editor } from "@toast-ui/react-editor"
import { useRequestGetEditorKeyboardHandler } from "../../apis/SettingApi"
import "codemirror/lib/codemirror.css"
import "@toast-ui/editor/dist/toastui-editor.css"
import "codemirror/keymap/vim.js"


interface Props {
  articleID: number
  content: string
}

const EditArticleContentMarkdown: FC<Props> = ({ articleID, content: initialContent }) => {
  const [editFetching, updateContent] = useRequestUpdateContent()
  const history = useHistory()
  const [_, getKeyboardHandler, keyboardHandler] = useRequestGetEditorKeyboardHandler()
  const { isDesktop } = useMediaQuery()
  const editorRef = useRef<Editor>(null)

  const onEdit = useCallback(() => {
    const content = editorRef.current?.getInstance().getMarkdown()
    updateContent(articleID, content!)
      .then(() => {
        window.location.href = `/articles/${articleID}`
      })
  }, [articleID, updateContent])

  useEffect(() => {
    if (!isDesktop) {
      return;
    }

    const editor = editorRef.current?.getInstance()
    if (!editor) {
      return
    }

    const cm = editor.getCodeMirror()
    cm.addKeyMap({ 'Ctrl-Enter': onEdit })

    getKeyboardHandler()
      .then(() => {
        if (keyboardHandler === 'vim') {
          cm.addKeyMap('vim')
        }
      })
  }, [isDesktop, getKeyboardHandler, keyboardHandler, editorRef, onEdit])

  return (
    <Wrapper>
      <Editor
        ref={editorRef}
        previewStyle={isDesktop ? 'vertical' : undefined}
        initialValue={initialContent}
        height="600px"
        initialEditType="markdown"
        toolbarItems={[]}
        hideModeSwitch
        usageStatistics={false}
      />
      <SubmitWrapper>
        <Button loading={editFetching} onClick={() => onEdit()}>Submit</Button>
        <Button type="white" onClick={() => history.goBack()}>Cancel</Button>
      </SubmitWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  padding: 10px 0;
`

const SubmitWrapper = styled.div`
  text-align: right;
  button {
    display: inline-flex;
  }
`

export default EditArticleContentMarkdown
