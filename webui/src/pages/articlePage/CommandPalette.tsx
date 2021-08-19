import React, { FC, useState } from "react"
import BaseCommandPalette from "../../component/etc/BaseCommandPalette"
import Article from "../../models/Article"
import { useHistory } from "react-router-dom"
import EditTagsPrompt from "../../component/article/EditTagsPrompt"
import { confirm } from "../../component/etc/GlobalConfirm"
import { useRequestDeleteArticle, useRequestUpdateTitle } from "../../apis/ArticleApi"
import { prompt } from "../../component/etc/GlobalPrompt"


interface Props {
  article: Article
  onReload: () => void
}

const CommandPalette: FC<Props> = ({article, onReload}) => {
  const [isEditTagsOpened, setEditTagsOpened] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, updateTitle] = useRequestUpdateTitle()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [__, deleteArticle] = useRequestDeleteArticle()
  const history = useHistory()

  const onEdit = () =>
    prompt({
      message: 'edit article title',
      initialValue: article.title,
      onOK: (newTitle: string) =>
        updateTitle(article.id, newTitle)
          .then(() => onReload())
    })

  const onDelete = () => {
    confirm({
      message: 'delete article?',
      onOK: () =>
        deleteArticle(article.id)
          .then(() => {
            if (history.length === 1) {
              history.push('/')
            } else {
              history.goBack()
            }
          })
    })
  }

  return (
    <>
      <BaseCommandPalette
        commands={[
          {name: 'edit', command: () => history.push(`/articles/${article.id}/edit`)},
          {name: 'edit title', command: () => onEdit()},
          {name: 'edit tags', command: () => setEditTagsOpened(true)},
          {name: 'delete', command: () => onDelete()},
        ]}
      />
      <EditTagsPrompt
        article={article}
        isOpened={isEditTagsOpened}
        onAfterEdit={() => {
          setEditTagsOpened(false)
          onReload()
        }}
        onClose={() => setEditTagsOpened(false)}
      />
    </>
  )
}

export default CommandPalette
