import React, { FC, useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import styled from "styled-components"
import NoteTitle from "./NoteTitle"
import NoteNavLayout from "../../component/layout/NoteNavLayout"
import Note from "../../models/Note"
import { useRequestGetNote, useRequestSwapParagraphs } from "../../apis/NoteApi"
import NoteParagraph from "./NoteParagraph"
import Article from "../../models/Article"
import { Button } from "@kiwicom/orbit-components"
import { Plus } from "@kiwicom/orbit-components/icons"
import CommandPalette from "./CommandPalette"


const NotePage: FC = () => {
  const {id} = useParams() as any
  const history = useHistory()
  const [fetching, onReload, swapParagraphSeq, note, referencedArticles] = useNote(id)

  return (
    <NoteNavLayout
      loading={fetching}
      title={note ? note.title : undefined}
    >
      {
        note && (
          <>
            <NoteTitle
              note={note}
              onReload={onReload}
            />
            {
              note.paragraphs
                .sort((a, b) => a.seq - b.seq)
                .map(paragraph =>
                  <NoteParagraph
                    key={paragraph.id}
                    paragraph={paragraph}
                    referencedArticles={referencedArticles}
                    onMoveUp={seq => swapParagraphSeq(seq, seq - 1)}
                    onMoveDown={seq => swapParagraphSeq(seq, seq + 1)}
                    onReload={onReload}
                  />
                )
            }
            <AddButtonWrapper>
              <Button
                iconLeft={<Plus />}
                type="secondary"
                onClick={() => history.push(`/notes/${id}/paragraphs`)}
                size="small"
              />
            </AddButtonWrapper>
            <CommandPalette
              note={note}
              onReload={onReload}
            />
          </>
        )
      }
    </NoteNavLayout>
  )
}

const useNote = (id: number): [
  boolean,
  () => void,
  (seqA: number, seqB: number) => void,
  Note | null,
  Article[],
] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fetching, getNote, note, referencedArticles, _, setNote] = useRequestGetNote()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [__, swapParagraphs] = useRequestSwapParagraphs()

  useEffect(() => {
    getNote(id)
  }, [ id, getNote ])

  const onReload = () => getNote(id)

  const swapParagraphSeq = (seqA: number, seqB: number) => {
    const swapA = note?.paragraphs.find(p => p.seq === seqA)
    const swapB = note?.paragraphs.find(p => p.seq === seqB)
    if (!swapA || !swapB) {
      return
    }

    swapA.seq = seqB
    swapB.seq = seqA
    swapParagraphs(id, swapA.id, swapB.id)

    setNote(Object.assign({}, note)) // refresh
  }

  return [fetching, onReload, swapParagraphSeq, note, referencedArticles]
}

const AddButtonWrapper = styled.div`
  text-align: center;
  padding: 10px 0;
  
  button {
    display: inline-flex;
  }
`

export default NotePage
