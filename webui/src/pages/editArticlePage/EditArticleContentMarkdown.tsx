import React, { FC, useCallback, useState } from "react"
import { Button, useMediaQuery } from "@kiwicom/orbit-components"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import { useRequestUpdateContent } from "../../apis/ArticleApi"
import TuiEditor from "../../component/tui/TuiEditor"


interface Props {
  articleID: number
  content: string
}

const EditArticleContentMarkdown: FC<Props> = ({ articleID, content: initialContent }) => {
  const [editor, setEditor] = useState(null as any)
  const [editFetching, updateContent] = useRequestUpdateContent()
  const history = useHistory()
  const { isDesktop } = useMediaQuery()

  const onEdit = useCallback(() => {
    const content = editor?.getMarkdown()
    updateContent(articleID, content)
      .then(() => history.push(`/articles/${articleID}`))
  }, [ updateContent, articleID, editor ])

  return (
    <Wrapper>
      <TuiEditor
        previewStyle={isDesktop ? 'vertical' : undefined}
        initialValue={initialContent}
        height="600px"
        onSubmit={onEdit}
        onLoad={(editor: any) => setEditor(editor)}
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
