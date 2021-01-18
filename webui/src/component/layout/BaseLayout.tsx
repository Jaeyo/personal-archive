import React, { FC } from "react"
import styled from "styled-components"
import { Container, Header, Loader, Sidebar } from "rsuite"
import TagTree from "../TagTree"
import BaseHeader from "./BaseHeader"


interface Props {
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const BaseLayout: FC<Props> = ({loading, size = 'md', children}) => (
  <Wrapper size={size}>
    <Header>
      <BaseHeader/>
    </Header>
    <Container>
      <Sidebar width={260}>
        <TagTree/>
      </Sidebar>
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

export default BaseLayout
