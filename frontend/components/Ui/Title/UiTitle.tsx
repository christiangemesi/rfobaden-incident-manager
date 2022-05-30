import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import { Themed } from '@/theme'

interface Props extends StyledProps {

  /**
   * Headings content to be displayed.
   */
  children: ReactNode

  /**
   * The level of the heading, between 1 and 6.
   */
  level: number

  /**
   * Centers the title.
   */
  isCentered?: boolean
}

/**
 * `UiTitle` displays a HTML heading.
 */
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
    font-weight: 600;
    font-size: 2.25em;
    line-height: 1.28;
    
    ${Themed.media.sm.max} {
      font-size: 2.75em;
    }
  }

  h2& {
    font-weight: 500;
    font-size: 1.8em;
    line-height: 1.22;

    ${Themed.media.sm.max} {
      font-size: 2em;
    }
  }

  h3& {
    font-weight: 500;
    font-size: 1.6em;
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
