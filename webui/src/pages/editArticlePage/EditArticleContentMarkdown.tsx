import React, { FC, RefObject, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import AceEditor from "react-ace"
import Article from "../../models/Article"
import { Alert, Button } from "rsuite"
import { requestUpdateContent } from "../../apis/ArticleApi"
import { useHistory } from "react-router-dom"
import MarkdownContent from "../../component/common/MarkdownContent"
import "ace-builds/src-noconflict/keybinding-vim"
import "ace-builds/src-noconflict/mode-markdown"
import "ace-builds/src-noconflict/theme-github"


interface Props {
  article: Article
}

const EditArticleContentMarkdown: FC<Props> = ({article}) => {
  const [content, setContent] = useState('')
  const history = useHistory()
  const [previewNode, previewDown, previewUp] = usePreviewNode()
  const [fetching, submit] = useSubmit()

  useEffect(() => {
    if (article) {
      setContent(article.content)
    }
  }, [article])

  const onSubmit = () => submit(article!.id, content)

  return (
    <WrapperDiv>
      <EditWrapperDiv>
        <EditAreaDiv>
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
                exec: editor => submit(article!.id, editor.getValue())
              },
            ]}
            editorProps={{
              $blockScrolling: true,
            }}
          />
        </EditAreaDiv>
        <PreviewDiv ref={previewNode}>
          <MarkdownContent content={content}/>
        </PreviewDiv>
      </EditWrapperDiv>
      <SubmitDiv>
        <Button onClick={() => history.goBack()}>Cancel</Button>
        <Button loading={fetching} onClick={onSubmit}>Submit</Button>
      </SubmitDiv>
    </WrapperDiv>
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

const useSubmit = (): [boolean, (articleID: number, content: string) => void] => {
  const [fetching, setFetching] = useState(false)

  const submit = (articleID: number, content: string) => {
    setFetching(true)
    requestUpdateContent(articleID, content)
      .then(() => window.location.href = `/articles/${articleID}`)
      .catch(err => {
        Alert.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, submit]
}

const WrapperDiv = styled.div`
  margin-top: 30px;
`

const EditWrapperDiv = styled.div`
  width: 100%;
`

const EditAreaDiv = styled.div`
  padding: 15px;
  float: left;
  width: 50%;
  
  // ace editor 에서 vim 활성화시 커서가 안보이는 버그 때문에 삽입
  .ace_cursor {
    display: block !important;
  }
`

const PreviewDiv = styled.div`
  padding: 15px;
  float: left;
  width: 50%;
  height: 800px;
  overflow: scroll;
`

const SubmitDiv = styled.div`
  text-align: right;
`

export default EditArticleContentMarkdown
