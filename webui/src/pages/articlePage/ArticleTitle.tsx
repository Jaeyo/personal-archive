import React, { FC } from "react"
import Article from "../../models/Article"
import { useHistory } from "react-router-dom"
import { useRequestDeleteArticle, useRequestUpdateTitle } from "../../apis/ArticleApi"
import ManagedTitle from "../../component/common/ManagedTitle"


interface Props {
  article: Article
  onReload: () => void
}

const ArticleTitle: FC<Props> = ({article, onReload}) => {
  const [editFetching, updateTitle] = useRequestUpdateTitle()
  const [deleteFetching, deleteArticle] = useRequestDeleteArticle()
  const history = useHistory()

  const onEdit = (title: string) => {
    updateTitle(article.id, title)
      .then(() => onReload())
  }

  const onDelete = () => {
    deleteArticle(article.id)
      .then(() => {
        if (history.length === 1) {
          history.push('/')
        } else {
          history.goBack()
        }
      })
  }

  return (
    <ManagedTitle
      title={article.title}
      onEdit={onEdit}
      onDelete={onDelete}
      editFetching={editFetching}
      deleteFetching={deleteFetching}
    />
  )
}

export default ArticleTitle
