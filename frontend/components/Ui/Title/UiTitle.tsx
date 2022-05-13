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
    font-size: 3.125em;
    line-height: 1.28;
    
    ${Themed.media.sm.max} {
      font-size: 2.75em;
    }
  }

  h2& {
    font-weight: 400;
    font-size: 2.25em;
    line-height: 1.22;

    ${Themed.media.sm.max} {
      font-size: 2em;
    }
  }

  h3& {
    font-weight: 400;
    font-size: 1.875em;
    line-height: 1.26;

    ${Themed.media.sm.max} {
      font-size: 1.625em;
    }
  }

  h4& {
    font-weight: 400;
    font-size: 1.5em;
    line-height: 1.25;
    
    ${Themed.media.sm.max} {
      font-size: 1.25em;
    }
  }

  h5& {
    font-weight: 400;
    font-size: 1.25em;
    line-height: 1.3;
    
    ${Themed.media.sm.max} {
      font-size: 1.125em;
    }
  }

  h6& {
    font-weight: 500;
    font-size: 1em;
    line-height: 1.4;
    
    ${Themed.media.sm.max} {
      font-size: 1em;
    }
  }
`