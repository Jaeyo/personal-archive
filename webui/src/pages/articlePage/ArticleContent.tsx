import React, { FC } from "react"
import Article, { Kind } from "../../models/Article"
import ArticleContentTweet from "./ArticleContentTweet"
import ArticleContentSlideShare from "./ArticleContentSlideShare"
import ArticleContentYoutube from "./ArticleContentYoutube"
import { useHistory } from "react-router-dom"
import { Button } from "rsuite"
import MarkdownContent from "../../component/common/MarkdownContent"


interface Props {
  article: Article
}

const ArticleContent: FC<Props> = ({article}) => {
  const history = useHistory()

  return article.kind === Kind.Tweet ?
    <ArticleContentTweet article={article}/> :
    article.kind === Kind.SlideShare ?
      <ArticleContentSlideShare article={article}/> :
      article.kind === Kind.Youtube ?
        <ArticleContentYoutube article={article}/> :
        <>
          <div style={{textAlign: 'right'}}>
            <Button
              appearance="link"
              onClick={() => history.push(`/articles/${article.id}/edit`)}
            >
              EDIT
            </Button>
          </div>
          <MarkdownContent content={article.content}/>
        </>
}

export default ArticleContent
