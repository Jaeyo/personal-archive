import React, { FC } from "react"
import { Container, Header, Loader } from "rsuite"
import BaseHeader from "./BaseHeader"
import styled from "styled-components"

interface Props {
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const SimpleLayout: FC<Props> = ({loading, size = 'md', children}) => (
  <Wrapper size={size}>
    <Header>
      <BaseHeader/>
    </Header>
    <Container>
      <StyledContent>
        {loading ? <Loader center/> : null}
        {children}
      </StyledContent>
    </Container>
  </Wrapper>
)

interface WrapperProps {
  size?: 'sm' | 'md' | 'lg'
}

const Wrapper = styled.div<WrapperProps>`
  max-width: ${({size}) => size === 'lg' ? '1920px' : size === 'md' ? '1280px' : '1024px'};
  margin: 0 auto;
`

const StyledContent = styled(Container)`
  padding: 20px;
  margin-bottom: 200px;
`

export default SimpleLayout
