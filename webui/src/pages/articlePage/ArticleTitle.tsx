import React, { FC, useEffect, useState } from "react"
import styled from "styled-components"
import Article from "../../models/Article"
import { Alert, Button, Icon, IconButton, Input } from "rsuite"
import { requestUpdateTitle } from "../../apis/ArticleApi"
import ArticleDeleteButton from "./ArticleDeleteButton"


interface Props {
  article: Article
}

const ArticleTitle: FC<Props> = ({article}) => {
  const [fetching, setFetching] = useState(false)
  const [isEditMode, setEditMode] = useState(false)
  const [title, setTitle] = useState('')

  useEffect(() => {
    if (article) {
      setTitle(article.title)
    }
  }, [article])

  const onSubmit = () => {
    setFetching(true)
    requestUpdateTitle(article!.id, title)
      .then(() => window.location.reload())
      .finally(() => setFetching(false))
      .catch(err => Alert.error(err.toString()))
  }

  if (!isEditMode) {
    return (
      <div>
        <Title>{article.title}</Title>
        <IconButton
          icon={<Icon icon="edit" />}
          onClick={() => setEditMode(true)}
          size="xs"
        />
        &nbsp;
        <ArticleDeleteButton articleID={article.id} />
      </div>
    )
  }

  return (
    <InputDiv>
      <TitleInput value={title} onChange={(v: string) => setTitle(v)} onPressEnter={onSubmit}/>
      <Button loading={fetching} onClick={onSubmit}>Submit</Button>
      <Button onClick={() => setEditMode(false)}>Cancel</Button>
    </InputDiv>
  )
}

const Title = styled.h1`
  display: inline;
  font-size: 24px;
  margin-right: 20px;
`

const InputDiv = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 18px;
  margin-bottom: 18px;
`

const TitleInput = styled(Input)`
  flex: auto;
`

export default ArticleTitle
