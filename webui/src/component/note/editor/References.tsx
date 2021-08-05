import React, { FC, useState } from "react"
import Article from "../../../models/Article"
import AddReferenceArticleDrawer from "./AddReferenceArticleDrawer"
import AddReferenceWebDrawer from "./AddReferenceWebDrawer"
import { Button, Tag } from "@kiwicom/orbit-components"
import { PlusCircle } from "@kiwicom/orbit-components/icons"
import styled from "styled-components"


interface Props {
  referenceArticles: Article[]
  referenceWebURLs: string[]
  onAddReferenceArticle: (article: Article) => void
  onAddReferenceWeb: (url: string) => void
  onRemoveReferenceArticle: (article: Article) => void
  onRemoveReferenceWeb: (url: string) => void
  onClickArticle: (article: Article) => void
  onClickWeb: (url: string) => void
}

const References: FC<Props> = (
  {
    referenceArticles,
    referenceWebURLs,
    onAddReferenceArticle,
    onAddReferenceWeb,
    onRemoveReferenceArticle,
    onRemoveReferenceWeb,
    onClickArticle,
    onClickWeb,
  }
) => {
  const [addReferenceArticleDrawerShow, setAddReferenceArticleDrawerShow] = useState(false)
  const [addReferenceWebDrawerShow, setAddReferenceWebDrawerShow] = useState(false)

  return (
    <>
      <TagWrapper>
        {
          referenceArticles.map(article => (
            <Tag
              key={article.id}
              size="small"
              onRemove={() => onRemoveReferenceArticle(article)}
              onClick={() => onClickArticle(article)}
            >
              {article.title}
            </Tag>
          ))
        }
        <Button
          iconLeft={<PlusCircle />}
          size="small"
          type="white"
          onClick={() => setAddReferenceArticleDrawerShow(true)}
        >
          Add article reference
        </Button>
      </TagWrapper>
      <TagWrapper>
        {
          referenceWebURLs.map(url => (
            <Tag
              key={url}
              onRemove={() => onRemoveReferenceWeb(url)}
              onClick={() => onClickWeb(url)}
            >
              {url}
            </Tag>
          ))
        }
        <Button
          iconLeft={<PlusCircle />}
          size="small"
          type="white"
          onClick={() => setAddReferenceWebDrawerShow(true)}
        >
          Add web reference
        </Button>
      </TagWrapper>
      <AddReferenceArticleDrawer
        show={addReferenceArticleDrawerShow}
        onConfirm={(article: Article) => {
          setAddReferenceArticleDrawerShow(false)
          onAddReferenceArticle(article)
        }}
        onCancel={() => setAddReferenceArticleDrawerShow(false)}
      />
      <AddReferenceWebDrawer
        show={addReferenceWebDrawerShow}
        onConfirm={(url: string) => {
          setAddReferenceWebDrawerShow(false)
          onAddReferenceWeb(url)
        }}
        onCancel={() => setAddReferenceWebDrawerShow(false)}
      />
    </>
  )
}

const TagWrapper = styled.div`
  margin-top: 15px;
`

export default References
