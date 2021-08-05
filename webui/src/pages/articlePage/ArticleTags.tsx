import React, { FC, useEffect, useState } from "react"
import styled from "styled-components"
import { useRecoilValue } from "recoil"
import Article from "../../models/Article"
import { articleTagsState } from "../../states/ArticleTags"
import { requestUpdateTags } from "../../apis/ArticleApi"
import ArticleTag from "../../component/article/ArticleTag"
import { toast } from "react-hot-toast"
import { Button } from "@kiwicom/orbit-components"
import TagSelector from "../../component/article/TagSelector"
import { FaTags } from "react-icons/fa"
import { Edit } from "@kiwicom/orbit-components/icons"


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
        <FaTags />
        <TagsSpan>tags: </TagsSpan>
        {
          article.tags.map(
            ({tag}) => <ArticleTag tag={tag} key={tag}/>
          )
        }
        <Button
          iconLeft={<Edit />}
          type="white"
          size="small"
          onClick={() => setEditMode(true)}
        />
      </ShowDiv>
    )
  }

  return (
    <InputDiv>
      <FaTags />
      <TagsSpan>tags: </TagsSpan>
      <TagSelector
        tags={articleTags.map(tag => tag.tag)}
        selectedTags={selectedTags}
        onChange={tags => setSelectedTags(tags)}
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
        toast.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, submit]
}

const ShowDiv = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  
  button {
    display: inline-flex;
  }
`

const TagsSpan = styled.span`
  margin-left: 8px;
  margin-right: 8px;
  font-size: 13px;
`

const InputDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 3px;
`

export default ArticleTags
