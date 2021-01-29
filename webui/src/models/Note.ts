import Paragraph from "./Paragraph"


export default interface Note {
  id: number
  title: string
  paragraphs: Paragraph[]
  created: string
  lastModified: string
}
