import React, { FC, useEffect, useState } from "react"
import { Alert, Loader, Tree } from "rsuite"
import styled from "styled-components"
import { useRecoilState } from "recoil"
import { useHistory } from "react-router-dom"
import { requestFindArticleTags } from "../../apis/ArticleTagApi"
import { articleTagsState } from "../../states/ArticleTags"
import { ArticleTagCount } from "../../models/ArticleTag"


const ArticleTagTree: FC = () => {
  const [fetching, articleTags, untaggedCount, allCount] = useRequestFindArticleTags()
  const history = useHistory()

  if (fetching) {
    return <Loader/>
  }

  return (
    <StyledTree
      data={toArticleTagItems(articleTags, untaggedCount, allCount)}
      onSelect={(_: any, tag: any) => history.push(`/tags/${encodeURIComponent(tag)}`)}
      defaultExpandAll
    />
  )
}

const useRequestFindArticleTags = (): [boolean, ArticleTagCount[], number, number] => {
  const [fetching, setFetching] = useState(false)
  const [articleTags, setArticleTags] = useRecoilState(articleTagsState)
  const [untaggedCount, setUntaggedCount] = useState(0)
  const [allCount, setAllCount] = useState(0)

  useEffect(() => {
    setFetching(true)
    requestFindArticleTags()
      .then(([articleTags, untaggedCount, allCount]) => {
        setArticleTags(articleTags)
        setUntaggedCount(untaggedCount)
        setAllCount(allCount)
      })
      .finally(() => setFetching(false))
      .catch(err => Alert.error(err.toString()))
  }, [setArticleTags, setUntaggedCount])

  return [fetching, articleTags, untaggedCount, allCount]
}

const StyledTree = styled(Tree)`
  max-height: 100vh;
  
  // hide scroll bar for chrome, safari, opera
  ::-webkit-scrollbar {
    display: none;
  }
  // hide scroll bar for IE and edge
  -ms-overflow-style: none;
  // hide scroll bar for firefix
  scrollbar-width: none;
`

interface DataItemType {
  value: string
  label: React.ReactNode
  children?: DataItemType[]
}

const toArticleTagItems = (articleTags: ArticleTagCount[], untaggedCount: number, allCount: number): DataItemType[] => {
  const results = [] as DataItemType[]

  results.push({
    value: 'all',
    label: <TagLabel><i>all ({allCount})</i></TagLabel>,
  })

  if (untaggedCount > 0) {
    results.push({
      value: 'untagged',
      label: <TagLabel><i>untagged ({untaggedCount})</i></TagLabel>,
    })
  }

  articleTags.forEach(articleTag => {
    const {tag, count} = articleTag

    results.push({
      value: tag,
      label: <TagLabel>{`${tag} (${count})`}</TagLabel>,
    })
  })

  return results
}

const TagLabel = styled.span`
  border-bottom: 1px dashed #ddd;
  padding-bottom: 2px;
`

export default ArticleTagTree
