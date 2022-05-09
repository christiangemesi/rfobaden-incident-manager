import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import UiHeader from '@/components/Ui/Header/UiHeader'
import UiFooter from '@/components/Ui/Footer/UiFooter'

interface Props {
  noHeader?: boolean
  noFooter?: boolean
  children?: ReactNode
}

const Page: React.VFC<Props> = ({
  noHeader = false,
  noFooter = false,
  children,
}) => {
  return (
    <React.Fragment>
      {noHeader || <UiHeader />}
      <Main noHeader={noHeader} noFooter={noFooter}>
        {children}
      </Main>
      {noFooter || <UiFooter />}
    </React.Fragment>
  )
}
export default Page

const Main = styled.main<{ noHeader: boolean, noFooter: boolean }>`
  --header-height: 5rem;
  --footer-height: 5rem;

  ${({ noHeader }) => noHeader && css`
    --header-height: 0px;
  `}
  ${({ noFooter }) => noFooter && css`
    --footer-height: 0px;
  `}

  position: relative;
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
`
