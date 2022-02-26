import React from 'react'
import styled from 'styled-components'

const UiFooter: React.VFC = () => {
  return (
    <FooterContainer />
  )
}

export default UiFooter

const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.secondary.value};
  height: 4rem;
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
`
