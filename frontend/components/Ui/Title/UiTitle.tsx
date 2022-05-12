import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import { Themed } from '@/theme'

interface Props extends StyledProps {
  children: ReactNode
  level: number
  isCentered?: boolean
}

const UiTitle: React.VFC<Props> = ({
  className,
  style,
  children,
  level,
  isCentered = false,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const H: any = `h${level}`
  return (
    <StyledTitle
      as={H}
      isCentered={isCentered}
      className={className}
      style={style}
      title={typeof children === 'string' ? children : undefined}
    >
      {children}
    </StyledTitle>
  )
}

export default styled(UiTitle)``

const StyledTitle = styled.div<{ isCentered: boolean }>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  
  ${({ isCentered }) => isCentered && css`
    text-align: center;
  `}

  h1& {
    font-weight: 300;
    font-size: 52px;
    line-height: 64px;
    letter-spacing: 0.2px;
    
    ${Themed.media.sm.max} {
      font-size: 44px;
    }
  }

  h2& {
    font-weight: 500;
    font-size: 44px;
    line-height: 54px;
    letter-spacing: 0;

    ${Themed.media.sm.max} {
      font-size: 32px;
    }
  }

  h3& {
    font-weight: 600;
    font-size: 32px;
    line-height: 40px;
    letter-spacing: 0.1px;

    ${Themed.media.sm.max} {
      font-size: 26px;
    }
  }

  h4& {
    font-weight: 500;
    font-size: 26px;
    line-height: 32px;
    letter-spacing: 0.2px;
    
    ${Themed.media.sm.max} {
      font-size: 20px;
    }
  }

  h5& {
    font-weight: 600;
    font-size: 20px;
    line-height: 26px;
    letter-spacing: 0.2px;
    
    ${Themed.media.sm.max} {
      font-size: 18px;
    }
  }

  h6& {
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.2px;
    
    ${Themed.media.sm.max} {
      font-size: 16px;
    }
  }
`