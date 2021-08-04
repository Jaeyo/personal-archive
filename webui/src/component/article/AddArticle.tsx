import React from "react"
import { Button } from "@kiwicom/orbit-components"
import { PlusCircle } from "@kiwicom/orbit-components/icons"
import styled from "styled-components"
import { useHistory } from "react-router-dom"


const AddArticle = () => {
  const history = useHistory()

  return (
    <Container>
      <Button
        type="primarySubtle"
        iconLeft={<PlusCircle/>}
        size="small"
        spaceAfter="small"
        onClick={() => history.push('/articles/new')}
      >
        Add article
      </Button>
    </Container>
  )
}

export default AddArticle

const Container = styled.div`
  float: right;
`
