import React, { FC } from "react"
import Article from "../../models/Article"
import { useHistory } from "react-router-dom"
import ManagedTitle from "../../component/common/ManagedTitle"
import { confirm } from "../../component/etc/GlobalConfirm"
import { useRequestDeleteArticle, useRequestUpdateTitle } from "../../apis/ArticleApi"
import { prompt } from "../../component/etc/GlobalPrompt"


interface Props {
  article: Article
  onReload: () => void
}

const ArticleTitle: FC<Props> = ({article, onReload}) => {
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

  const onDelete = () =>
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

  return (
    <ManagedTitle
      title={article.title}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  )
}

export default ArticleTitle
