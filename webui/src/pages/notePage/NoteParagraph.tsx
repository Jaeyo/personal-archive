import React, { FC } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import MarkdownContent from "../../component/common/MarkdownContent"
import Paragraph from "../../models/Paragraph"
import Article from "../../models/Article"
import NoteParagraphButtons from "./NoteParagraphButtons"
import { FaRegStickyNote } from "react-icons/fa"
import { IoEarthOutline } from "react-icons/all"
import { Tag } from "@kiwicom/orbit-components"


interface Props {
  paragraph: Paragraph
  referencedArticles: Article[]
  onMoveUp: (seq: number) => void
  onMoveDown: (seq: number) => void
  onReload: () => void
}

const NoteParagraph: FC<Props> = ({paragraph, referencedArticles, onMoveUp, onMoveDown, onReload}) => {
  const currentReferencedArticleIDs = paragraph.referenceArticles.map(a => a.articleID)
  const currentReferencedArticles = referencedArticles
    .filter((article: Article) => currentReferencedArticleIDs.includes(article.id))

  return (
    <WrapperPanel>
      <NoteParagraphButtons
        paragraph={paragraph}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onReload={onReload}
      />
      <MarkdownContent content={paragraph.content}/>
      <div style={{textAlign: 'right'}}>
        {
          currentReferencedArticles.map(article => (
            <Tag key={`article-${article.id}`} size="small">
              <Link to={`/articles/${article.id}`}>
                <FaRegStickyNote />
                &nbsp;
                {article.title}
              </Link>
            </Tag>
          ))
        }
        {
          paragraph.referenceWebs.map(web => (
            <Tag key={`web-${web.id}`} size="small">
              <IoEarthOutline />
              &nbsp;
              <a href={web.url} target="_blank" rel="noreferrer">{web.url}</a>
            </Tag>
          ))
        }
      </div>
    </WrapperPanel>
  )
}

const WrapperPanel = styled.div`
  margin: 10px 0;
  padding: 10px 0;
  border-bottom: 1px dashed #ddd;
`

export default NoteParagraph
