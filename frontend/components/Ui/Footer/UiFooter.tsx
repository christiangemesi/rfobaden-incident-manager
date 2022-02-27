import React from 'react'
import styled from 'styled-components'
import UiLink from '@/components/Ui/Link/UiLink'
import Image from 'next/image'

const UiFooter: React.VFC = () => {
  return (
    <FooterContainer>
      <UiLink href="https://rfobaden.ch/">
        RFO Baden
      </UiLink>
        &copy; {new Date().getFullYear()} RFO Baden
      <UiLink href="https://www.fhnw.ch/de/">
        <Image src="/fhnw-logo.svg" alt="FHNW Logo" width="108" height="25" />
      </UiLink>
    </FooterContainer>
  )
}

export default UiFooter

const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.secondary.value};
  height: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 50px;
  font-size: 0.8em;
`
