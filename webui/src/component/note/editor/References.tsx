import React, { FC, useState } from "react"
import styled from "styled-components"
import { Icon, IconButton, Tag, TagGroup } from "rsuite"
import Article from "../../../models/Article"
import AddReferenceArticleDrawer from "./AddReferenceArticleDrawer"
import AddReferenceWebDrawer from "./AddReferenceWebDrawer"


interface Props {
  referenceArticles: Article[]
  referenceWebURLs: string[]
  onAddReferenceArticle: (article: Article) => void
  onAddReferenceWeb: (url: string) => void
  onRemoveReferenceArticle: (article: Article) => void
  onRemoveReferenceWeb: (url: string) => void
  onClickArticle: (article: Article) => void
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
  }
) => {
  const [addReferenceArticleDrawerShow, setAddReferenceArticleDrawerShow] = useState(false)
  const [addReferenceWebDrawerShow, setAddReferenceWebDrawerShow] = useState(false)

  return (
    <>
      <ReferenceTagGroup>
        {
          referenceArticles.map(article => (
            <Tag
              key={article.id}
              closable
              onClose={() => onRemoveReferenceArticle(article)}
            >
              <a href="#!" onClick={() => onClickArticle(article)}>
                {article.title}
              </a>
            </Tag>
          ))
        }
        <AddReferenceBtn
          icon={<Icon icon="plus"/>}
          size="sm"
          appearance="link"
          onClick={() => setAddReferenceArticleDrawerShow(true)}
        >
          Add article reference
        </AddReferenceBtn>
      </ReferenceTagGroup>
      <ReferenceTagGroup>
        {
          referenceWebURLs.map(url => (
            <Tag
              key={url}
              closable
              onClose={() => onRemoveReferenceWeb(url)}
            >
              {url}
            </Tag>
          ))
        }
        <AddReferenceBtn
          icon={<Icon icon="plus"/>}
          size="sm"
          appearance="link"
          onClick={() => setAddReferenceWebDrawerShow(true)}
        >
          Add web reference
        </AddReferenceBtn>
      </ReferenceTagGroup>
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

const ReferenceTagGroup = styled(TagGroup)`
  margin-top: 15px;
`

const AddReferenceBtn = styled(IconButton)`
  margin-left: 10px;
`

export default References
