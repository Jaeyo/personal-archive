import React, { FC, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useRequestGetArticle, useRequestGetArticleContent } from "../../apis/ArticleApi"
import ArticleTitle from "../articlePage/ArticleTitle"
import ArticleTags from "../articlePage/ArticleTags"
import ArticleLink from "../articlePage/ArticleLink"
import SimpleLayout from "../../component/layout/SimpleLayout"
import EditArticleContentMarkdown from "./EditArticleContentMarkdown"
import CommandPalette from "./CommandPalette"


const EditArticlePage: FC = () => {
  const {id} = useParams() as any
  const [fetching, getArticle, article] = useRequestGetArticle()
  const [contentFetching, getContent, content] = useRequestGetArticleContent()

  useEffect(() => {
    getArticle(id)
    getContent(id)
  }, [ id, getArticle, getContent ])

  const onReload = () => getArticle(id)

  return (
    <SimpleLayout
      loading={fetching || contentFetching}
      title={article ? article.title : undefined}
    >
      {
        article && !contentFetching && (
          <>
            <ArticleTitle article={article!} onReload={onReload} />
            <ArticleTags article={article!} onReload={onReload} />
            <ArticleLink article={article!} />
            <EditArticleContentMarkdown articleID={id} content={content} />
            <CommandPalette
              article={article!}
              onReload={onReload}
            />
          </>
        )
      }
    </SimpleLayout>
  )
}

export default EditArticlePage
