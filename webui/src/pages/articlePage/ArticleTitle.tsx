import React, { FC } from "react"
import Article from "../../models/Article"
import { useHistory } from "react-router-dom"
import { useRequestDeleteArticle, useRequestUpdateTitle } from "../../apis/ArticleApi"
import ManagedTitle from "../../component/common/ManagedTitle"
import { reloadAfterTick } from "../../common/Utils"


interface Props {
  article: Article | null
}

const ArticleTitle: FC<Props> = ({article}) => {
  const [editFetching, updateTitle] = useRequestUpdateTitle()
  const [deleteFetching, deleteArticle] = useRequestDeleteArticle()
  const history = useHistory()

  const onEdit = (title: string) => {
    updateTitle(article!.id, title)
      .then(() => window.location.reload())
  }

  const onDelete = () => {
    deleteArticle(article!.id)
      .then(() => {
        if (history.length === 1) {
          history.push('/')
        } else {
          history.goBack()
          reloadAfterTick()
        }
      })
  }

  return (
    <ManagedTitle
      title={article ? article.title : '...'}
      onEdit={onEdit}
      onDelete={onDelete}
      editFetching={editFetching}
      deleteFetching={deleteFetching}
    />
  )
}

export default ArticleTitle
