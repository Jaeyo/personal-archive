import React, { FC, useEffect, useState } from "react"
import { Button, Textarea } from "@kiwicom/orbit-components"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import { useRequestUpdateContent } from "../../apis/ArticleApi"


interface Props {
  articleID: number
  content: string
}

const EditArticleContentMarkdownMobile: FC<Props> = ({ articleID, content: initialContent }) => {
  const [content, setContent] = useState('')
  const [editFetching, updateContent] = useRequestUpdateContent()
  const history = useHistory()

  useEffect(() => {
    setContent(initialContent)
  }, [initialContent, setContent])

  const onEdit = (articleID: number, content: string) =>
    updateContent(articleID, content)
      .then(() => {
        window.location.href = `/articles/${articleID}`
      })

  return (
    <Wrapper>
      <Textarea
        value={content}
        onChange={e => setContent((e.target as any).value)}
        rows={15}
        fullHeight
        spaceAfter="normal"
      />
      <SubmitWrapper>
        <Button loading={editFetching} onClick={() => onEdit(articleID, content)}>Submit</Button>
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

export default EditArticleContentMarkdownMobile
