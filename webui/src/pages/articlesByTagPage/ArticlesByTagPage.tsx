import React, { FC, useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useRequestFindArticlesByTag } from "../../apis/ArticleApi"
import ArticleTagTreeLayout from "../../component/layout/ArticleTagTreeLayout"
import TagTitle from "./TagTitle"
import { usePage } from "../../common/Hooks"
import ArticleList from "../../component/article/ArticleList"
import AddArticle from "../../component/article/AddArticle"
import CommandPalette from "./CommandPalette"


const ArticlesByTagPage: FC = () => {
  const tag = decodeURIComponent((useParams() as any).tag)
  const page = usePage()
  const history = useHistory()
  const [fetching, findArticlesByTag, articles, pagination] = useRequestFindArticlesByTag()

  useEffect(() => {
    findArticlesByTag(tag, page)
  }, [ tag, page, findArticlesByTag ])

  const onReload = (newTag?: string) =>
    history.push(`/tags/${encodeURIComponent(newTag || tag)}`)

  return (
    <ArticleTagTreeLayout
      loading={fetching}
      title={tag}
    >
      <AddArticle />
      <TagTitle
        tag={tag}
        onReload={onReload}
      />
      <ArticleList
        articles={articles}
        pagination={pagination}
        onSelectPage={page => history.push(`/tags/${encodeURIComponent(tag)}?page=${page}`)}
        onReload={onReload}
      />
      <CommandPalette
        tag={tag}
        onReload={onReload}
      />
    </ArticleTagTreeLayout>
  )
}

export default ArticlesByTagPage
