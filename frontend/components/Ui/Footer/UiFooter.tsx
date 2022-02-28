import React from 'react'
import styled from 'styled-components'
import UiLink from '@/components/Ui/Link/UiLink'
import Image from 'next/image'

const UiFooter: React.VFC = () => {
  return (
    <FooterContainer>
      <UiLink href="https://rfobaden.ch/" target="_blank">
        RFO Baden
      </UiLink>
      &copy; {new Date().getFullYear()} RFO Baden
      <UiLink href="https://www.fhnw.ch/de/" target="_blank">
        <Image src="/fhnw-logo.svg" alt="FHNW Logo" width="108" height="25" />
      </UiLink>
    </FooterContainer>
  )
}

export default UiFooter

const FooterContainer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
  padding: 10px 50px;
  background: ${({ theme }) => theme.colors.secondary.value};
  font-size: 0.8em;
`

