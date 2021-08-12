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
  _title: string
  tags: ArticleTag[]
  created: Date
  lastModified: Date

  constructor(obj: any) {
    this.id = obj.id
    this.kind = obj.kind
    this.url = obj.url
    this._title = obj.title
    this.tags = obj.tags
    this.created = new Date(obj.created)
    this.lastModified = new Date(obj.lastModified)
  }

  get title(): string {
    return this._title || '[empty title]'
  }

  set title(value: string) {
    this._title = value
  }
}
