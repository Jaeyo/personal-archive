import React, { FC } from "react"
import styled from "styled-components"
import MainLayout from "./MainLayout"
import { Loading } from "@kiwicom/orbit-components"

interface Props {
  loading?: boolean
}

const SimpleLayout: FC<Props> = ({loading, children }) => (
  <MainLayout>
    <StyledContent>
      {loading ? <Loading type="boxLoader"/> : null}
      {children}
    </StyledContent>
  </MainLayout>

)

const StyledContent = styled.div`
  padding: 20px;
  margin-bottom: 200px;
`

export default SimpleLayout
