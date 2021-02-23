import React, { FC, useEffect, useState } from "react"
import styled from "styled-components"
import { Alert, Button, Icon, IconButton, TagPicker } from "rsuite"
import { useRecoilValue } from "recoil"
import Article from "../../models/Article"
import { toTagPickerItemTypes } from "../../common/Types"
import { articleTagsState } from "../../states/ArticleTags"
import { requestUpdateTags } from "../../apis/ArticleApi"
import ArticleTag from "../../component/article/ArticleTag"


interface Props {
  article: Article
}

const ArticleTags: FC<Props> = ({article}) => {
  const [isEditMode, setEditMode] = useState(false)
  const [selectedTags, setSelectedTags] = useState([] as string[])
  const articleTags = useRecoilValue(articleTagsState)
  const [fetching, submit] = useSubmit(article)

  useEffect(() => {
    if (article) {
      setSelectedTags(article.tags.map(({tag}) => tag))
    }
  }, [article])

  if (!isEditMode) {
    return (
      <ShowDiv>
        <Icon icon="tag"/>
        <TagsSpan>tags: </TagsSpan>
        {
          article.tags.map(
            ({tag}) => <ArticleTag tag={tag} key={tag}/>
          )
        }
        <EditButton
          icon={<Icon icon="edit"/>}
          size="xs"
          onClick={() => setEditMode(true)}
        />
      </ShowDiv>
    )
  }

  return (
    <InputDiv>
      <Icon icon="tag"/>
      <TagsSpan>tags: </TagsSpan>
      <TagInput
        data={toTagPickerItemTypes(articleTags, selectedTags)}
        creatable
        cleanable={false}
        defaultOpen
        tagProps={{color: 'red'}}
        onChange={(tags: string[]) => setSelectedTags(tags)}
        value={selectedTags}
      />
      <Button loading={fetching} onClick={() => submit(selectedTags)}>Submit</Button>
      <Button onClick={() => setEditMode(false)}>Cancel</Button>
    </InputDiv>
  )
}

const useSubmit = (article: Article): [boolean, (selectedTags: string[]) => void] => {
  const [fetching, setFetching] = useState(false)

  const submit = (selectedTags: string[]) => {
    setFetching(true)
    requestUpdateTags(article!.id, selectedTags)
      .then(() => window.location.reload())
      .catch(err => {
        Alert.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, submit]
}

const ShowDiv = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`

const TagsSpan = styled.span`
  margin-left: 8px;
  margin-right: 8px;
  font-size: 13px;
`

const EditButton = styled(IconButton)`
  margin-left: 10px;
`

const InputDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 3px;
`

const TagInput = styled(TagPicker)`
  flex: auto;
`

export default ArticleTags
