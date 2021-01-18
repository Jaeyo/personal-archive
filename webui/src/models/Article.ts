import ArticleTag from "./ArticleTag"

export const Kind = {
  Markdown: 'markdown',
  Tweet: 'tweet',
}

export default interface Article {
  id: number
  kind: string
  url: string
  content: string
  title: string
  tags: ArticleTag[]
  created: Date
  lastModified: Date
}
