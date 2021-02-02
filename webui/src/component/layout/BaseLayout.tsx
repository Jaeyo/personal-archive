import React, { FC } from "react"
import { Container, Header } from "rsuite"
import BaseHeader from "./BaseHeader"
import styled from "styled-components"

interface Props {
  size?: 'sm' | 'md' | 'lg'
}

const BaseLayout: FC<Props> = ({size = 'md', children}) => (
  <Wrapper size={size}>
    <Header>
      <BaseHeader/>
    </Header>
    <Container>
      {children}
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

export default BaseLayout
