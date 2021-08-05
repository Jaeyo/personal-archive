import React, { FC, useState } from "react"
import { useRecoilValue } from "recoil"
import ArticleTagTreeLayout from "../../component/layout/ArticleTagTreeLayout"
import { articleTagsState } from "../../states/ArticleTags"
import { requestCreateArticleByURL } from "../../apis/ArticleApi"
import { toast } from "react-hot-toast"
import { Button, InputField, Loading } from "@kiwicom/orbit-components"
import TagSelector from "../../component/article/TagSelector"


const CreateArticlePage: FC = () => {
  const [url, setUrl] = useState('')
  const articleTags = useRecoilValue(articleTagsState)
  const [selectedTags, setSelectedTags] = useState([] as string[])
  const [fetching, submit] = useSubmit()

  const onSubmit = () => submit(url, selectedTags)

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

const useSubmit = (): [boolean, (url: string, selectedTags: string[]) => void] => {
  const [fetching, setFetching] = useState(false)

  const submit = (url: string, selectedTags: string[]) => {
    setFetching(true)
    requestCreateArticleByURL(url, selectedTags)
      .then(article => {
        window.location.href = `/articles/${article.id}`
      })
      .catch(err => {
        toast.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, submit]
}

export default CreateArticlePage