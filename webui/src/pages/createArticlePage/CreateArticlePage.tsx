import React, { FC, useState } from "react"
import { useRecoilValue } from "recoil"
import ArticleTagTreeLayout from "../../component/layout/ArticleTagTreeLayout"
import { articleTagsState } from "../../states/ArticleTags"
import { useRequestCreateArticleByURL } from "../../apis/ArticleApi"
import { Button, InputField, Loading } from "@kiwicom/orbit-components"
import TagSelector from "../../component/article/TagSelector"


const CreateArticlePage: FC = () => {
  const [url, setUrl] = useState('')
  const articleTags = useRecoilValue(articleTagsState)
  const [selectedTags, setSelectedTags] = useState([] as string[])
  const [fetching, createArticleByURL, article] = useRequestCreateArticleByURL()

  const onSubmit = () =>
    createArticleByURL(url, selectedTags)
      .then(() => {
        if (article) {
          window.location.href = `/articles/${article.id}`
        }
      })

  return (
    <ArticleTagTreeLayout>
      {fetching ? <Loading type="boxLoader" /> : null}
      <InputField
        placeholder="URL"
        value={url}
        onChange={e => setUrl((e.target as any).value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onSubmit()
          }
        }}
      />
      <TagSelector
        tags={articleTags.map(tag => tag.tag)}
        selectedTags={selectedTags}
        onChange={tags => setSelectedTags(tags)}
      />
      <Button
        loading={fetching}
        type="primary"
        onClick={onSubmit}>
        Submit
      </Button>
    </ArticleTagTreeLayout>
  )
}

export default CreateArticlePage