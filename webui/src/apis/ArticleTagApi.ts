import { useGet, usePut } from "./index"
import { ArticleTagCount } from "../models/ArticleTag"
import { AxiosError } from "axios"
import { useCallback, useState } from "react"


export const useRequestFindArticleTags = (): [
  boolean,
  () => Promise<void>,
  ArticleTagCount[],
  number,
  number,
  AxiosError | null,
] => {
  const [fetching, fetchGet, error] = useGet()
  const [articleTagCounts, setArticleTagCounts] = useState([] as ArticleTagCount[])
  const [untaggedCount, setUntaggedCount] = useState(0)
  const [allCount, setAllCount] = useState(0)

  const findArticleTags = (): Promise<void> =>
    fetchGet(`/apis/article-tags`, resp => {
      setArticleTagCounts(resp.data.articleTagCounts)
      setUntaggedCount(resp.data.untaggedCount)
      setAllCount(resp.data.allCount)
    })

  return [fetching, useCallback(findArticleTags, [fetchGet]), articleTagCounts, untaggedCount, allCount, error]
}

export const useRequestUpdateTag = (): [
  boolean,
  (tag: string, newTag: string) => Promise<void>,
  AxiosError | null,
] => {
  const [fetching, fetchPut, error] = usePut()

  const updateTag = (tag: string, newTag: string): Promise<void> =>
    fetchPut(`/apis/article-tags/tag/${encodeURIComponent(tag)}`, {tag: newTag})

  return [fetching, useCallback(updateTag, [fetchPut]), error]
}
