import React, { FC } from "react"
import YouTube from "react-youtube"
import Article from "../../models/Article"


interface Props {
  article: Article
}

const ArticleContentYoutube: FC<Props> = ({ article }) => (
  <YouTube
    videoId={article.content}
    opts={{
      playerVars: {
        autoplay: 1,
      }
    }}
  />
)

export default ArticleContentYoutube
