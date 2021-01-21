import ArticleTag from "./ArticleTag"
import readingTime from "reading-time"

export const Kind = {
  Markdown: 'markdown',
  Tweet: 'tweet',
  SlideShare: 'slideshare',
}

export default class Article {
  id: number
  kind: string
  url: string
  content: string
  title: string
  tags: ArticleTag[]
  created: Date
  lastModified: Date
  readingTime: string

  constructor(obj: any) {
    this.id = obj.id
    this.kind = obj.kind
    this.url = obj.url
    this.content = obj.content
    this.title = obj.title
    this.tags = obj.tags
    this.created = obj.created
    this.lastModified = obj.lastModified
    this.readingTime = readingTime(obj.content).text
  }
}
