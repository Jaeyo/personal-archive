import React, { FC, useState } from "react"
import { Alert } from "rsuite"
import Article from "../../models/Article"
import { useHistory } from "react-router-dom"
import { requestDeleteArticle, requestUpdateTitle } from "../../apis/ArticleApi"
import ManagedTitle from "../../component/common/ManagedTitle"
import { reloadAfterTick } from "../../common/Utils"


interface Props {
  article: Article | null
}

const ArticleTitle: FC<Props> = ({article}) => {
  const [submitFetching, submitArticle] = useSubmit(article)
  const [deleteFetching, deleteArticle] = useDelete(article)

  return (
    <ManagedTitle
      title={article ? article.title : '...'}
      onSubmit={submitArticle}
      onDelete={deleteArticle}
      submitFetching={submitFetching}
      deleteFetching={deleteFetching}
    />
  )
}

const useSubmit = (article: Article | null): [boolean, (title: string) => void] => {
  const [fetching, setFetching] = useState(false)

  const submit = (title: string) => {
    setFetching(true)
    requestUpdateTitle(article!.id, title)
      .then(() => window.location.reload())
      .catch(err => {
        Alert.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, submit]
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
        Alert.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, deleteArticle]
}

export default ArticleTitle
