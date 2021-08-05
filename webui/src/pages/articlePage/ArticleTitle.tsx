import React, { FC, useState } from "react"
import Article from "../../models/Article"
import { useHistory } from "react-router-dom"
import { requestDeleteArticle, requestUpdateTitle } from "../../apis/ArticleApi"
import ManagedTitle from "../../component/common/ManagedTitle"
import { reloadAfterTick } from "../../common/Utils"
import { toast } from "react-hot-toast"


interface Props {
  article: Article | null
}

const ArticleTitle: FC<Props> = ({article}) => {
  const [editFetching, editArticle] = useEdit(article)
  const [deleteFetching, deleteArticle] = useDelete(article)

  return (
    <ManagedTitle
      title={article ? article.title : '...'}
      onEdit={editArticle}
      onDelete={deleteArticle}
      editFetching={editFetching}
      deleteFetching={deleteFetching}
    />
  )
}

const useEdit = (article: Article | null): [boolean, (title: string) => void] => {
  const [fetching, setFetching] = useState(false)

  const edit = (title: string) => {
    setFetching(true)
    requestUpdateTitle(article!.id, title)
      .then(() => window.location.reload())
      .catch(err => {
        toast.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, edit]
}

const useDelete = (article: Article | null): [boolean, () => void] => {
  const [fetching, setFetching] = useState(false)
  const history = useHistory()

  const deleteArticle = () => {
    setFetching(true)
    requestDeleteArticle(article!.id)
      .then(() => {
        if (history.length === 1) {
          history.push('/')
        } else {
          history.goBack()
          reloadAfterTick()
        }
      })
      .catch(err => {
        toast.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, deleteArticle]
}

export default ArticleTitle
