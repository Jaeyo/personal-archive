import React, { FC, useEffect, useState } from "react"
import Article from "../../models/Article"
import { Button, Loading, Textarea } from "@kiwicom/orbit-components"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import { useRequestGetArticleContent, useRequestUpdateContent } from "../../apis/ArticleApi"


interface Props {
  article: Article
}

const EditArticleContentMarkdownMobile: FC<Props> = ({ article }) => {
  const [ content, setContent ] = useState('')
  const [editFetching, updateContent] = useRequestUpdateContent()
  const [contentFetching, getContent, fetchedContent] = useRequestGetArticleContent()
  const history = useHistory()

  useEffect(() => {
    if (article) {
      getContent(article.id).then(() => setContent(fetchedContent))
    }
  }, [ article, getContent, fetchedContent ])

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
      <Textarea
        value={content}
        onChange={e => setContent((e.target as any).value)}
        rows={15}
        fullHeight
        spaceAfter="normal"
      />
      <SubmitWrapper>
        <Button loading={editFetching} onClick={() => onEdit(article!.id, content)}>Submit</Button>
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
