import React, { FC, useState } from "react"
import styled from "styled-components"
import Article from "../../models/Article"
import ArticleTag from "../../component/article/ArticleTag"
import { Button } from "@kiwicom/orbit-components"
import { FaTags } from "react-icons/fa"
import { Edit } from "@kiwicom/orbit-components/icons"
import EditTagsPrompt from "../../component/article/EditTagsPrompt"


interface Props {
  article: Article
  onReload: () => void
}

const ArticleTags: FC<Props> = ({article, onReload}) => {
  const [isEditPromptOpened, setEditPromptOpened] = useState(false)

  return (
    <Wrapper>
      <FaTags />
      <TagsSpan>tags: </TagsSpan>
      {
        article.tags.map(
          ({tag}) => <ArticleTag tag={tag} key={tag}/>
        )
      }
      <Button
        iconLeft={<Edit />}
        type="white"
        size="small"
        onClick={() => setEditPromptOpened(true)}
      />
      <EditTagsPrompt
        article={article}
        isOpened={isEditPromptOpened}
        onAfterEdit={() => {
          setEditPromptOpened(false)
          onReload()
        }}
        onClose={() => setEditPromptOpened(false)}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  
  button {
    display: inline-flex;
  }
`

const TagsSpan = styled.span`
  margin-left: 8px;
  margin-right: 8px;
  font-size: 13px;
`

export default ArticleTags
