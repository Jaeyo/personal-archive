import Article from "../models/Article"
import { requestDelete, requestGet, requestPost, requestPut } from "./index"
import { Pagination } from "../common/Types"

export const requestCreateArticleByURL = async (url: string, tags: string[]): Promise<Article> => {
  const resp = await requestPost(`/apis/articles`, {url, tags})
  return new Article(resp.data.article)
}

export const requestGetArticle = async (id: number): Promise<Article> => {
  const resp = await requestGet(`/apis/articles/${id}`)
  return new Article(resp.data.article)
}

export const requestUpdateTitle = async (id: number, title: string): Promise<void> => {
  await requestPut(`/apis/articles/${id}/title`, {title})
}

export const requestUpdateTags = async (id: number, tags: string[]): Promise<void> => {
  await requestPut(`/apis/articles/${id}/tags`, {tags})
}

export const requestUpdateContent = async (id: number, content: string): Promise<void> => {
  await requestPut(`/apis/articles/${id}/content`, {content})
}

export const requestFindArticlesByTag = async (tag: string, page: number): Promise<[Article[], Pagination]> => {
  const resp = await requestGet(`/apis/articles/tags/${encodeURIComponent(tag)}?page=${page}`)
  return [
    resp.data.articles.map((article: any) => new Article(article)),
    resp.data.pagination,
  ]
}

export const requestSearchArticles = async (keyword: string, page: number): Promise<[Article[], Pagination]> => {
  const resp = await requestGet(`/apis/articles/search?q=${encodeURIComponent(keyword)}&page=${page}`)
  return [
    resp.data.articles.map((article: any) => new Article(article)),
    resp.data.pagination,
  ]
}

export const requestDeleteArticle = async (id: number): Promise<void> => {
  await requestDelete(`/apis/articles/${id}`)
}