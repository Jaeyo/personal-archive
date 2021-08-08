import React, { FC, useEffect, useState } from "react"
import Article from "../../models/Article"
import { Button, Textarea } from "@kiwicom/orbit-components"
import styled from "styled-components"
import { useEditContent } from "./hooks"
import { useHistory } from "react-router-dom"


interface Props {
  article: Article
}

const EditArticleContentMarkdownMobile: FC<Props> = ({ article }) => {
  const [ content, setContent ] = useState('')
  const [fetching, edit] = useEditContent()
  const history = useHistory()

  useEffect(() => {
    setContent(article.content)
  }, [ article ])

  const onEdit = () => edit(article!.id, content)

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
        <Button loading={fetching} onClick={onEdit}>Submit</Button>
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
