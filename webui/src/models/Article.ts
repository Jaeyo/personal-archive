import ArticleTag from "./ArticleTag"

export const Kind = {
  Markdown: 'markdown',
  Tweet: 'tweet',
  SlideShare: 'slideshare',
  Youtube: 'youtube',
}

export default class Article {
  id: number
  kind: string
  url: string
  title: string
  tags: ArticleTag[]
  created: Date
  lastModified: Date

  constructor(obj: any) {
    this.id = obj.id
    this.kind = obj.kind
    this.url = obj.url
    this.title = obj.title
    this.tags = obj.tags
    this.created = new Date(obj.created)
    this.lastModified = new Date(obj.lastModified)
  }
}
