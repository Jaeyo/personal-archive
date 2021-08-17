import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import Article from "../../../models/Article"
import References from "./References"
import { usePrevious } from "../../../common/Hooks"
import Confirm from "../../common/Confirm"
import ArticleContent from "../../../pages/articlePage/ArticleContent"
import { Button, Switch, useMediaQuery } from "@kiwicom/orbit-components"
import { VscOpenPreview } from "react-icons/vsc"
import { useRequestGetEditorKeyboardHandler } from "../../../apis/SettingApi"
import { Editor } from "@toast-ui/react-editor"


interface Props {
  content: string
  referenceArticles: Article[]
  referenceWebURLs: string[]
  onSubmit: (content: string, referenceArticles: Article[], referenceWebURLs: string[]) => void
  fetching: boolean
}

const NoteEditor: FC<Props> = (
  {
    content: initialContent,
    referenceArticles: initRefArticles,
    referenceWebURLs: initRefWebURLs,
    onSubmit: submit,
    fetching
  }
) => {
  const [_, getKeyboardHandler, keyboardHandler] = useRequestGetEditorKeyboardHandler()
  const [refArticles, setRefArticles] = useState(initRefArticles)
  const [refWebURLs, setRefWebURLs] = useState(initRefWebURLs)
  const [previewArticle, setPreviewArticle] = useState((initRefArticles.length > 0 ? initRefArticles[0] : null) as Article | null)
  const [showPreview, setShowPreview] = useState(true)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const { isDesktop } = useMediaQuery()

  const previewNode = useRef<HTMLDivElement>(null)
  const submitBtnNode = useRef<HTMLButtonElement>(null)
  const history = useHistory()

  const prevInitRefArticles = usePrevious(initRefArticles)
  const prevInitRefWebURLs = usePrevious(initRefWebURLs)

  const editorRef = useRef<Editor>(null)

  useEffect(() => {
    if (initRefArticles?.length !== prevInitRefArticles?.length) {
      setRefArticles(initRefArticles)
      if (initRefArticles.length > 0) {
        setPreviewArticle(initRefArticles[0])
      }
    }
    if (initRefWebURLs?.length !== prevInitRefWebURLs?.length) {
      setRefWebURLs(initRefWebURLs)
    }
  }, [prevInitRefArticles, prevInitRefWebURLs, initRefArticles, initRefWebURLs])

  const onSubmit = useCallback(() => {
    const content = editorRef.current?.getInstance().getMarkdown() as string
    submit(content, refArticles, refWebURLs)
  }, [refArticles, refWebURLs, submit])

  const previewDown = () => {
    const top = (previewNode.current?.scrollTop || 0) + 150
    previewNode.current?.scrollTo({top})
  }

  const previewUp = () => {
    const top = (previewNode.current?.scrollTop || 0) - 150
    previewNode.current?.scrollTo({top})
  }

  useEffect(() => {
    const editor = editorRef.current?.getInstance()
    if (!editor) {
      return
    }

    const cm = editor.getCodeMirror()
    cm.addKeyMap({
      'Ctrl-Enter': onSubmit,
      'Ctrl-J': previewDown,
      'Ctrl-K': previewUp,
    })

    getKeyboardHandler()
      .then(() => {
        if (keyboardHandler === 'vim') {
          cm.addKeyMap('vim')
        }
      })
  }, [getKeyboardHandler, keyboardHandler, onSubmit])

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

  const isPreviewable = isDesktop && showPreview && previewArticle != null
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
          <Editor
            ref={editorRef}
            initialValue={initialContent}
            height="800px"
            initialEditType="markdown"
            toolbarItems={[]}
            hideModeSwitch
            usageStatistics={false}
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
