import React, { FC } from "react"
import styled from "styled-components"
import MainLayout from "./MainLayout"
import { Loading } from "@kiwicom/orbit-components"

interface Props {
  loading?: boolean
  title?: string
}

const SimpleLayout: FC<Props> = ({loading, title, children }) => (
  <MainLayout title={title}>
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
