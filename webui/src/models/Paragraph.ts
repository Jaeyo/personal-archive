import ReferenceArticle from "./ReferenceArticle"
import ReferenceWeb from "./ReferenceWeb"


export default interface Paragraph {
  id: number
  noteID: number
  seq: number
  content: string
  referenceArticles: ReferenceArticle[]
  referenceWebs : ReferenceWeb[]
  created: string
  lastModified: string
}
