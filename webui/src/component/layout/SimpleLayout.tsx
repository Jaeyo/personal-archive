import React, { FC } from "react"
import { Container, Loader } from "rsuite"
import BaseLayout from "./BaseLayout"
import styled from "styled-components"

interface Props {
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const SimpleLayout: FC<Props> = ({loading, size = 'md', children}) => (
  <BaseLayout size={size}>
    <StyledContent>
      {loading ? <Loader center/> : null}
      {children}
    </StyledContent>
  </BaseLayout>

)

const StyledContent = styled(Container)`
  padding: 20px;
  margin-bottom: 200px;
`

export default SimpleLayout
