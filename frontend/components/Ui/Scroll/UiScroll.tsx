import React, { ReactNode, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import 'overlayscrollbars/css/OverlayScrollbars.min.css'
import OverlayScrollbars from 'overlayscrollbars'

interface Props extends StyledProps {
  isLeft: boolean
  disableX?: boolean
  disableY?: boolean
  children: ReactNode
}

const UiScroll: React.VFC<Props> = ({
  isLeft = false,
  disableX = false,
  disableY = false,
  className,
  style,
  children,
}) => {
  const options = useMemo<OverlayScrollbars.Options>(() => ({
    normalizeRTL: isLeft,
    scrollbars: {
      autoHide: 'move',
    },
    overflowBehavior: {
      x: disableX ? 'hidden' : 'scroll',
      y: disableY ? 'hidden' : 'scroll',
    },
  }), [isLeft, disableX, disableY])
  return (
    <OverlayScrollbarsComponent className={className} style={style} options={options}>
      {children}
    </OverlayScrollbarsComponent>
  )
}
export default styled(UiScroll)`
  ${({ isLeft }) => isLeft && css`
    direction: rtl;
    & > * {
      direction: ltr;
    }
  `}
`
