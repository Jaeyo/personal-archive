import React, { FC, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import AceEditor from "react-ace"
import { Ace } from "ace-builds"
import Article from "../../../models/Article"
import References from "./References"
import { usePrevious } from "../../../common/Hooks"
import Confirm from "../../common/Confirm"
import ArticleContent from "../../../pages/articlePage/ArticleContent"
import { Button, Switch } from "@kiwicom/orbit-components"
import { VscOpenPreview } from "react-icons/vsc"
import "ace-builds/src-noconflict/keybinding-vim"
import "ace-builds/src-noconflict/mode-markdown"
import "ace-builds/src-noconflict/theme-github"
import { useRequestGetEditorKeyboardHandler } from "../../../apis/SettingApi"


interface Props {
  content: string
  referenceArticles: Article[]
  referenceWebURLs: string[]
  onSubmit: (content: string, referenceArticles: Article[], referenceWebURLs: string[]) => void
  fetching: boolean
}

const NoteEditor: FC<Props> = (
  {
    content: initContent,
    referenceArticles: initRefArticles,
    referenceWebURLs: initRefWebURLs,
    onSubmit: submit,
    fetching
  }
) => {
  const [_, getKeyboardHandler, keyboardHandler] = useRequestGetEditorKeyboardHandler()
  const [content, setContent] = useState(initContent)
  const [refArticles, setRefArticles] = useState(initRefArticles)
  const [refWebURLs, setRefWebURLs] = useState(initRefWebURLs)
  const [previewArticle, setPreviewArticle] = useState((initRefArticles.length > 0 ? initRefArticles[0] : null) as Article | null)
  const [showPreview, setShowPreview] = useState(true)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)

  const previewNode = useRef<HTMLDivElement>(null)
  const submitBtnNode = useRef<HTMLButtonElement>(null)
  const editor = useRef<Ace.Editor | null>(null)
  const history = useHistory()

  const prevInitContent = usePrevious(initContent)
  const prevInitRefArticles = usePrevious(initRefArticles)
  const prevInitRefWebURLs = usePrevious(initRefWebURLs)

  useEffect(() => {
    getKeyboardHandler()

    if (initContent !== prevInitContent) {
      setContent(initContent)
    }

    if (initRefArticles?.length !== prevInitRefArticles?.length) {
      setRefArticles(initRefArticles)
      if (initRefArticles.length > 0) {
        setPreviewArticle(initRefArticles[0])
      }
    }
    if (initRefWebURLs?.length !== prevInitRefWebURLs?.length) {
      setRefWebURLs(initRefWebURLs)
    }
  }, [getKeyboardHandler, prevInitContent, prevInitRefArticles, prevInitRefWebURLs, initContent, initRefArticles, initRefWebURLs])

  useEffect(() => {
    editor.current?.resize()
  }, [showPreview, previewArticle])

  const onSubmit = () => {
    submit(content, refArticles, refWebURLs)
  }

  const onAddRefArticle = (article: Article) => {
    if (refArticles.find(a => a.id === article.id)) {
      return
    }
    setRefArticles([...refArticles, article])
    setPreviewArticle(article)
  }

  const onAddRefWeb = (url: string) => {
    if (refWebURLs.find(u => u === url)) {
      return
    }
    setRefWebURLs([...refWebURLs, url])
  }

  const onRemoveRefArticle = (article: Article) => {
    setRefArticles(refArticles.filter(a => a.id !== article.id))
    if (previewArticle?.id === article.id) {
      setPreviewArticle(null)
    }
  }

  const onRemoveRefWeb = (url: string) => {
    setRefWebURLs(refWebURLs.filter(u => u !== url))
  }

  const previewDown = () => {
    const top = (previewNode.current?.scrollTop || 0) + 150
    previewNode.current?.scrollTo({top})
  }

  const previewUp = () => {
    const top = (previewNode.current?.scrollTop || 0) - 150
    previewNode.current?.scrollTo({top})
  }

  const isPreviewable = showPreview && previewArticle != null
  const editorWidth = isPreviewable ? '48%' : '100%'

  return (
    <>
      <PreviewSwitchWrapper>
        <Switch
          icon={<VscOpenPreview/>}
          checked={showPreview}
          onChange={() => setShowPreview(!showPreview)}
        />
      </PreviewSwitchWrapper>
      <div>
        <EditArea width={editorWidth}>
          <AceEditor
            mode="markdown"
            theme="github"
            value={content}
            onChange={v => setContent(v)}
            width="100%"
            height="800px"
            wrapEnabled
            keyboardHandler={keyboardHandler || 'vim'}
            tabSize={2}
            focus={true}
            onLoad={instance => {
              editor.current = instance
            }}
            commands={[
              {name: 'down', bindKey: {mac: 'ctrl+j', win: 'ctrl+j'}, exec: previewDown},
              {name: 'up', bindKey: {mac: 'ctrl+k', win: 'ctrl+k'}, exec: previewUp},
              {
                name: 'submit', bindKey: {mac: 'ctrl+enter', win: 'ctrl+enter'}, exec: editor => {
                  editor.blur()
                  setShowSubmitConfirm(true)
                }
              },
            ]}
            editorProps={{
              $blockScrolling: true,
            }}
          />
        </EditArea>
        {
          !isPreviewable ?
            null :
            <Preview ref={previewNode}>
              <ArticleContent article={previewArticle!}/>
            </Preview>
        }
      </div>
      <References
        referenceArticles={refArticles}
        referenceWebURLs={refWebURLs}
        onAddReferenceArticle={onAddRefArticle}
        onAddReferenceWeb={onAddRefWeb}
        onRemoveReferenceArticle={onRemoveRefArticle}
        onRemoveReferenceWeb={onRemoveRefWeb}
        onClickArticle={(article) => setPreviewArticle(article)}
        onClickWeb={url => window.open(url, '_blank')}
      />
      <SubmitWrapper>
        <Button type="white" onClick={() => history.goBack()}>Cancel</Button>
        <Button onClick={() => setShowSubmitConfirm(true)} loading={fetching} ref={submitBtnNode}>Submit</Button>
      </SubmitWrapper>
      <Confirm
        show={showSubmitConfirm}
        onOK={onSubmit}
        onClose={() => setShowSubmitConfirm(false)}
      >
        Submit?
      </Confirm>
    </>
  )
}


const PreviewSwitchWrapper = styled.div`
  text-align: right;
  margin: 10px 0;
`

const EditArea = styled.div<{ width: string }>`
  padding: 15px;
  float: left;
  width: ${props => props.width};
  
  // ace editor 에서 vim 활성화시 커서가 안보이는 버그 때문에 삽입
  .ace_cursor {
    display: block !important;
  }
`

const Preview = styled.div`
  padding: 15px;
  float: left;
  width: 48%;
  height: 800px;
  overflow: scroll;
`

const SubmitWrapper = styled.div`
  text-align: right;
  margin-top: 25px;
  
  button {
    display: inline-flex;
  }
`

export default NoteEditor
