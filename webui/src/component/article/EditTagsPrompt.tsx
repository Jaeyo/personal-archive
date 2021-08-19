import React, { FC, useCallback, useEffect, useState } from "react"
import Article from "../../models/Article"
import Confirm from "../common/Confirm"
import TagSelector from "./TagSelector"
import { useRequestUpdateTags } from "../../apis/ArticleApi"
import { useRequestFindArticleTags } from "../../apis/ArticleTagApi"
import { useHotKeys } from "../../common/Hooks"


interface Props {
  article: Article
  isOpened: boolean
  onAfterEdit: () => void
  onClose: () => void
}

const EditTagsPrompt: FC<Props> = ({article, isOpened, onAfterEdit, onClose: close}) => {
  const [selectedTags, setSelectedTags] = useState(article.tags.map(({ tag }) => tag))
  const [tagsFetching, findArticleTags, articleTagCounts] = useRequestFindArticleTags()
  const [submitFetching, updateTags] = useRequestUpdateTags()

  useEffect(() => {
    if (isOpened) {
      findArticleTags()
    }
  }, [isOpened, findArticleTags])

  const onEdit = useCallback(
    () => updateTags(article.id, selectedTags)
      .then(() => onAfterEdit()),
    [updateTags, article, selectedTags, onAfterEdit],
  )

  const onClose = () => {
    setSelectedTags(article.tags.map(({ tag }) => tag))
    close()
  }

  useHotKeys('enter', () => {
    if (isOpened) {
      onEdit()
    }
  })

  useHotKeys('esc', () => {
    if (isOpened) {
      onClose()
    }
  })


  return (
    <Confirm
      show={isOpened}
      onOK={onEdit}
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

export default EditTagsPrompt
