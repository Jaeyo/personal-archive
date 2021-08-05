import React, { FC, useState } from "react"
import Article from "../../models/Article"
import { Tweet } from "react-twitter-widgets"
import { Loading } from "@kiwicom/orbit-components"


interface Props {
  article: Article
}

const ArticleContentTweet: FC<Props> = ({article}) => {
  const [ isFetching, setFetching ] = useState(true)

  return (
    <>
      { isFetching ? <Loading type="boxLoader" /> : null }
      <Tweet
        tweetId={article.content}
        onLoad={() => setFetching(false)}
      />
    </>
  )
}

export default ArticleContentTweet
