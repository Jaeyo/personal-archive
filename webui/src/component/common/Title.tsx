import styled from "styled-components"


const Title = styled.h1`
  word-break: break-all;
  display: inline;
  font-size: 20px;
  
  position: relative;
  
  :after {
    background-color: #cddc39;
    content: " ";
    height: 40%;
    position: absolute;
    left: 0;
    margin-left: -.3em;
    top: 65%;
    width: calc(100% + 1rem);
    z-index: -1;
    opacity: .65;
    transform: skew(-13deg);
  }
`

export default Title
