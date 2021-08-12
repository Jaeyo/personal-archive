import React, { FC } from "react"
import YouTube from "react-youtube"


interface Props {
  content: string
}

const ArticleContentYoutube: FC<Props> = ({ content }) => (
  <YouTube
    videoId={content}
    opts={{
      playerVars: {
        autoplay: 1,
      }
    }}
  />
)

export default ArticleContentYoutube
