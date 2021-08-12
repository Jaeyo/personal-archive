import React, { FC, useState } from "react"
import { Tweet } from "react-twitter-widgets"
import { Loading } from "@kiwicom/orbit-components"


interface Props {
  content: string
}

const ArticleContentTweet: FC<Props> = ({ content }) => {
  const [ isFetching, setFetching ] = useState(true)

  return (
    <>
      { isFetching ? <Loading type="boxLoader" /> : null }
      <Tweet
        tweetId={content}
        onLoad={() => setFetching(false)}
      />
    </>
  )
}

export default ArticleContentTweet
