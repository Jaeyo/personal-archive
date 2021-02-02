import React, { FC, useEffect, useRef, useState } from "react"
import { Alert, Button, Input, Loader, TagPicker } from "rsuite"
import { useRecoilValue } from "recoil"
import ArticleTagTreeLayout from "../../component/layout/ArticleTagTreeLayout"
import { articleTagsState } from "../../states/ArticleTags"
import { requestCreateArticleByURL } from "../../apis/ArticleApi"
import { toTagPickerItemTypes } from "../../common/Types"


const CreateArticlePage: FC = () => {
  const [fetching, setFetching] = useState(false)
  const [url, setUrl] = useState('')
  const articleTags = useRecoilValue(articleTagsState)
  const [selectedTags, setSelectedTags] = useState([] as string[])
  const urlInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    urlInputRef?.current?.focus()
  }, [urlInputRef])

  const onSubmit = () => {
    setFetching(true)
    requestCreateArticleByURL(url, selectedTags)
      .then(article => {
        window.location.href = `/articles/${article.id}`
      })
      .catch(err => {
        Alert.error(err.toString())
        setFetching(false)
      })
  }

  return (
    <ArticleTagTreeLayout>
      {fetching ? <Loader center /> : null}
      <Input
        inputRef={urlInputRef}
        placeholder="URL"
        value={url}
        onChange={v => setUrl(v)}
        onPressEnter={onSubmit}
      />
      <TagPicker
        data={toTagPickerItemTypes(articleTags, selectedTags)}
        creatable
        cleanable={false}
        style={{width: 500}}
        menuStyle={{width: 500}}
        tagProps={{color: 'red'}}
        onChange={tags => setSelectedTags(tags)}
        value={selectedTags}
      />
      <Button
        loading={fetching}
        appearance="primary"
        onClick={onSubmit}>
        Submit
      </Button>
    </ArticleTagTreeLayout>
  )
}

export default CreateArticlePage