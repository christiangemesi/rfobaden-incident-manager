import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'

interface Props {
  children: ReactNode
  level: number
  isCentered?: boolean
}

const UiTitle: React.VFC<Props> = ({
  children,
  level,
  isCentered = false,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const H: any = `h${level}`
  return (
    <StyledTitle as={H} isCentered={isCentered}>
      {children}
    </StyledTitle>
  )
}

export default UiTitle

const StyledTitle = styled.div<{isCentered: boolean}>`
  ${({ isCentered }) => isCentered && css`
    text-align: center;
  `}
  
  
  h1& {
    font-weight: 300;
    font-size: 52px;
    line-height: 64px;
    letter-spacing: 0.2px;
  }
  
  h2& {
    font-weight: 500;
    font-size: 44px;
    line-height: 54px;
    letter-spacing: 0;
  }
  
  h3& {
    font-weight: 600;
    font-size: 32px;
    line-height: 40px;
    letter-spacing: 0.1px;
  }
  
  h4& {
    font-weight: 500;
    font-size: 26px;
    line-height: 32px;
    letter-spacing: 0.2px;
  }
  
  h5& {
    font-weight: 600;
    font-size: 20px;
    line-height: 26px;
    letter-spacing: 0.2px;
  }
  
  h6& {
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.2px;
  }
`