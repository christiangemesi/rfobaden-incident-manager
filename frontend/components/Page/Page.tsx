import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import PageHeader from '@/components/Page/Header/PageHeader'
import PageFooter from '@/components/Page/Footer/PageFooter'
import { Themed } from '@/theme'

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
      {noHeader || <PageHeader />}
      <Main noHeader={noHeader} noFooter={noFooter}>
        {children}
      </Main>
      {noFooter || <PageFooter />}
    </React.Fragment>
  )
}
export default Page

const Main = styled.main<{ noHeader: boolean, noFooter: boolean }>`
  --header-height: 7rem;
  --footer-height: 6rem;

  ${({ noHeader }) => noHeader && css`
    --header-height: 0px;
  `}
  ${({ noFooter }) => noFooter && css`
    --footer-height: 0px;
  `}

  position: relative;
  min-height: calc(100vh - var(--header-height) - var(--footer-height));

  ${Themed.media.xs.only} {
    padding-top: 5rem;

    ${({ noHeader }) => noHeader && css`
      padding-top: 0;
    `}
  }
`
