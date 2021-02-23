import React, { FC, useState } from "react"
import styled from "styled-components"
import { Link, useHistory } from "react-router-dom"
import MarkdownContent from "../../component/common/MarkdownContent"
import Paragraph from "../../models/Paragraph"
import { Alert, Icon, IconButton, Panel, Tag } from "rsuite"
import Article from "../../models/Article"
import Confirm from "../../component/common/Confirm"
import { requestDeleteParagraph } from "../../apis/NoteApi"


interface Props {
  paragraph: Paragraph
  referencedArticles: Article[]
  onMoveUp: (seq: number) => void
  onMoveDown: (seq: number) => void
}

const NoteParagraph: FC<Props> = ({ paragraph, referencedArticles, onMoveUp, onMoveDown }) => {
  const [deleteConfirmShow, setDeleteConfirmShow] = useState(false)
  const [ fetching, deleteParagraph ] = useDelete(paragraph)
  const history = useHistory()

  const currentReferencedArticleIDs = paragraph.referenceArticles.map(a => a.articleID)
  const currentReferencedArticles = referencedArticles
    .filter((article: Article) => currentReferencedArticleIDs.includes(article.id))

  return (
    <WrapperPanel bordered>
      <div style={{ textAlign: 'right' }}>
        <IconButton
          icon={<Icon icon="chevron-up" />}
          onClick={() => onMoveUp(paragraph.seq)}
          size="xs"
        />
        &nbsp;
        <IconButton
          icon={<Icon icon="chevron-down" />}
          onClick={() => onMoveDown(paragraph.seq)}
          size="xs"
        />
        &nbsp;
        <IconButton
          icon={<Icon icon="edit"/>}
          onClick={() => history.push(`/notes/${paragraph.noteID}/paragraphs/${paragraph.id}/edit`)}
          size="xs"
        />
        &nbsp;
        <IconButton
          loading={fetching}
          icon={<Icon icon={"trash"}/>}
          onClick={() => setDeleteConfirmShow(true)}
          size="xs"
        />
        <Confirm
          show={deleteConfirmShow}
          onOK={deleteParagraph}
          onClose={() => setDeleteConfirmShow(false)}
        >
          DELETE?
        </Confirm>
      </div>
      <MarkdownContent content={paragraph.content} />
      <div style={{ textAlign: 'right' }}>
        {
          currentReferencedArticles.map(article => (
            <Tag key={`article-${article.id}`}>
              <Link to={`/articles/${article.id}`}>
                <Icon icon="sticky-note-o" />
                &nbsp;
                {article.title}
              </Link>
            </Tag>
          ))
        }
        {
          paragraph.referenceWebs.map(web => (
            <Tag key={`web-${web.id}`}>
              <Icon icon="web" />
              &nbsp;
              <a href={web.url} target="_blank" rel="noreferrer">{web.url}</a>
            </Tag>
          ))
        }
      </div>
    </WrapperPanel>
  )
}

const useDelete = (paragraph: Paragraph): [ boolean, () => void ] => {
  const [fetching, setFetching] = useState(false)

  const deleteParagraph = () => {
    setFetching(true)
    requestDeleteParagraph(paragraph.noteID, paragraph.id)
      .then(() => window.location.reload())
      .catch(err => {
        Alert.error(err.toString())
        setFetching(false)
      })
  }

  return [ fetching, deleteParagraph ]
}

const WrapperPanel = styled(Panel)`
  margin: 10px 0;
`

export default NoteParagraph
