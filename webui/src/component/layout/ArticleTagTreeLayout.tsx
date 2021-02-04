import React, { FC } from "react"
import styled from "styled-components"
import { Button, Container, Loader } from "rsuite"
import { useHistory } from "react-router-dom"
import ArticleTagTree from "../article/ArticleTagTree"
import MainLayout from "./MainLayout"


interface Props {
  loading?: boolean
}

const ArticleTagTreeLayout: FC<Props> = ({loading, children}) => {
  const history = useHistory()

  return (
    <MainLayout
      side={
        <>
          <NewButton
            appearance="primary"
            onClick={() => history.push('/articles/new')}
          >
            New Article
          </NewButton>
          <ArticleTagTree/>
        </>
      }
    >
      <StyledContent>
        {loading ? <Loader center/> : null}
        {children}
      </StyledContent>
    </MainLayout>
  )
}

const StyledContent = styled(Container)`
  padding: 20px;
  margin-bottom: 200px;
`

const NewButton = styled(Button)`
  margin-bottom: 15px;
  margin-left: 40px;
  width: 200px;
`

export default ArticleTagTreeLayout
