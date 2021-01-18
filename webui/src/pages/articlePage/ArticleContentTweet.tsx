import React, { FC, useState } from "react"
import Article from "../../models/Article"
import { Tweet } from "react-twitter-widgets"
import { Loader } from "rsuite"


interface Props {
  article: Article
}

const ArticleContentTweet: FC<Props> = ({article}) => {
  const [ isFetching, setFetching ] = useState(true)

  return (
    <>
      { isFetching ? <Loader /> : null }
      <Tweet
        tweetId={article.content}
        onLoad={() => setFetching(false)}
      />
    </>
  )
}

export default ArticleContentTweet
