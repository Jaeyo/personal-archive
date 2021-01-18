export default interface ArticleTag {
  id: number
  tag: string
  articleID: number
}

export interface ArticleTagCount {
  tag: string
  count: number
}