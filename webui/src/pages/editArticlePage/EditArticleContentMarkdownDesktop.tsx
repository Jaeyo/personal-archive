import React, { FC, RefObject, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import AceEditor from "react-ace"
import Article from "../../models/Article"
import { useHistory } from "react-router-dom"
import MarkdownContent from "../../component/common/MarkdownContent"
import { Button, Loading } from "@kiwicom/orbit-components"
import "ace-builds/src-noconflict/keybinding-vim"
import "ace-builds/src-noconflict/mode-markdown"
import "ace-builds/src-noconflict/theme-github"
import { useRequestGetArticleContent, useRequestUpdateContent } from "../../apis/ArticleApi"


interface Props {
  article: Article
}

const EditArticleContentMarkdownDesktop: FC<Props> = ({article}) => {
  const [content, setContent] = useState('')
  const history = useHistory()
  const [previewNode, previewDown, previewUp] = usePreviewNode()
  const [editFetching, updateContent] = useRequestUpdateContent()
  const [contentFetching, getContent, fetchedContent] = useRequestGetArticleContent()

  useEffect(() => {
    if (article) {
      getContent(article.id).then(() => setContent(fetchedContent))
    }
  }, [article, getContent, fetchedContent])

  const onEdit = (articleID: number, content: string) =>
    updateContent(articleID, content)
      .then(() => {
        window.location.href = `/articles/${articleID}`
      })

  if (contentFetching) {
    return <Loading type="boxLoader" />
  }

  return (
    <Wrapper>
      <EditAreaWrapper>
        <EditArea>
          <AceEditor
            mode="markdown"
            theme="github"
            value={content}
            onChange={v => setContent(v)}
            width="100%"
            height="800px"
            wrapEnabled
            keyboardHandler="vim"
            tabSize={2}
            focus={true}
            commands={[
              {name: 'down', bindKey: {mac: 'ctrl+j', win: 'ctrl+j'}, exec: previewDown},
              {name: 'up', bindKey: {mac: 'ctrl+k', win: 'ctrl+k'}, exec: previewUp},
              {
                name: 'submit',
                bindKey: {mac: 'ctrl+enter', win: 'ctrl+enter'},
                exec: editor => onEdit(article!.id, editor.getValue())
              },
            ]}
            editorProps={{
              $blockScrolling: true,
            }}
          />
        </EditArea>
        <Preview ref={previewNode}>
          <MarkdownContent content={content}/>
        </Preview>
      </EditAreaWrapper>
      <SubmitWrapper>
        <Button loading={editFetching} onClick={() => onEdit(article!.id, content)}>Submit</Button>
        <Button type="white" onClick={() => history.goBack()}>Cancel</Button>
      </SubmitWrapper>
    </Wrapper>
  )
}

const usePreviewNode = (): [RefObject<HTMLDivElement>, () => void, () => void] => {
  const previewNode = useRef<HTMLDivElement>(null)

  const previewDown = () => {
    const top = (previewNode.current?.scrollTop || 0) + 150
    previewNode.current?.scrollTo({top})
  }

  const previewUp = () => {
    const top = (previewNode.current?.scrollTop || 0) - 150
    previewNode.current?.scrollTo({top})
  }

  return [previewNode, previewDown, previewUp]
}

const Wrapper = styled.div`
  margin-top: 30px;
`

const EditAreaWrapper = styled.div`
  width: 100%;
`

const EditArea = styled.div`
  float: left;
  padding: 15px;
  width: 48%;
  
  // ace editor 에서 vim 활성화시 커서가 안보이는 버그 때문에 삽입
  .ace_cursor {
    display: block !important;
  }
`

const Preview = styled.div`
  float: left;
  padding: 15px;
  width: 48%;
  height: 800px;
  overflow: scroll;
`

const SubmitWrapper = styled.div`
  text-align: right;
  button {
    display: inline-flex;
  }
`

export default EditArticleContentMarkdownDesktop
