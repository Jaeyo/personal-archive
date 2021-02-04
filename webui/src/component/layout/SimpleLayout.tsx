import React, { FC } from "react"
import { Container, Loader } from "rsuite"
import styled from "styled-components"
import MainLayout from "./MainLayout"

interface Props {
  loading?: boolean
  size?: 'md' | 'lg'
}

const SimpleLayout: FC<Props> = ({loading, children, size = 'md' }) => (
  <MainLayout size={size}>
    <StyledContent>
      {loading ? <Loader center/> : null}
      {children}
    </StyledContent>
  </MainLayout>

)

const StyledContent = styled(Container)`
  padding: 20px;
  margin-bottom: 200px;
`

export default SimpleLayout
