import React, { FC, useState } from "react"
import ArticleTagTreeLayout from "../../component/layout/ArticleTagTreeLayout"
import { useRequestCreateArticleByURL } from "../../apis/ArticleApi"
import { Button, InputField, Loading } from "@kiwicom/orbit-components"


// TODO IMME: convert to modal
const CreateArticlePage: FC = () => {
  const [url, setUrl] = useState('')
  const [fetching, createArticleByURL, article] = useRequestCreateArticleByURL()

  const onSubmit = () =>
    createArticleByURL(url, [])
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