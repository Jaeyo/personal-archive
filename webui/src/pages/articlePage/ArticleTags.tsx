import React, { FC, useEffect, useState } from "react"
import styled from "styled-components"
import Article from "../../models/Article"
import { useRequestUpdateTags } from "../../apis/ArticleApi"
import ArticleTag from "../../component/article/ArticleTag"
import { Button } from "@kiwicom/orbit-components"
import TagSelector from "../../component/article/TagSelector"
import { FaTags } from "react-icons/fa"
import { Edit } from "@kiwicom/orbit-components/icons"
import Confirm from "../../component/common/Confirm"
import { useRequestFindArticleTags } from "../../apis/ArticleTagApi"


interface Props {
  article: Article
}

const ArticleTags: FC<Props> = ({article}) => {
  const [isEditPromptOpened, setEditPromptOpened] = useState(false)

  return (
    <Wrapper>
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
        onClick={() => setEditPromptOpened(true)}
      />
      <EditPrompt
        isOpened={isEditPromptOpened}
        articleID={article.id}
        defaultTags={article.tags.map(({ tag }) => tag)}
        onClose={() => setEditPromptOpened(false)}
      />
    </Wrapper>
  )
}

const EditPrompt: FC<{
  isOpened: boolean,
  articleID: number,
  defaultTags: string[],
  onClose: () => void,
}> = ({ isOpened, articleID, defaultTags, onClose: close }) => {
  const [selectedTags, setSelectedTags] = useState(defaultTags)
  const [tagsFetching, findArticleTags, articleTagCounts] = useRequestFindArticleTags()
  const [submitFetching, updateTags] = useRequestUpdateTags()

  useEffect(() => {
    if (isOpened) {
      findArticleTags()
    }
  }, [isOpened, findArticleTags])

  const onSubmit = () => {
    updateTags(articleID, selectedTags)
      .then(() => {
        close()
        window.location.href = `/articles/${articleID}`
      })
  }

  const onClose = () => {
    setSelectedTags(defaultTags)
    close()
  }

  return (
    <Confirm
      show={isOpened}
      onOK={onSubmit}
      onClose={onClose}
      loading={tagsFetching || submitFetching}
    >
      <TagSelector
        tags={articleTagCounts.map(a => a.tag)}
        selectedTags={selectedTags}
        onChange={tags => setSelectedTags(tags)}
      />
    </Confirm>
  )
}

const Wrapper = styled.div`
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

export default ArticleTags
