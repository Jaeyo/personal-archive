import { requestGet, requestPut } from "./index"
import { ArticleTagCount } from "../models/ArticleTag"


export const requestFindArticleTags = async (): Promise<[ArticleTagCount[], number, number]> => {
  const resp = await requestGet(`/apis/article-tags`)
  return [
    resp.data.articleTagCounts,
    resp.data.untaggedCount,
    resp.data.allCount,
  ]
}

export const requestUpdateTag = async (tag: string, newTag: string): Promise<void> => {
  await requestPut(`/apis/article-tags/tag/${tag}`, {tag: newTag})
}
