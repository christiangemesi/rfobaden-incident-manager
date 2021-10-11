import styled, { css } from 'styled-components'
import React, { CSSProperties, ReactNode } from 'react'
import { Breakpoint, Themed } from '@/theme'
import StyleHelper from '@/utils/helpers/StyleHelper'

interface Props {
  gap?: number
  gapH?: number
  gapV?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

const UiGrid = styled(StyleHelper.tag<Props>('div'))`
  position: relative;
  display: flex;
  flex-wrap: wrap;

  ${({ gap = 0, gapH = gap, gapV = gap }) => {
    gapH = Math.max(0, gapH) / 2
    gapV = Math.max(0, gapV) / 2
    return css`
      margin: ${-gapV}rem ${-gapH}rem;
      & > ${Col} {
        --gap-v: ${gapV}rem;
        --gap-h: ${gapH}rem;
        margin: var(--gap-v) var(--gap-h);
      }
    `
  }}
`

interface ColProps {
  size?: ColSizeProp
  order?: Order
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

const Col = styled(StyleHelper.tag<ColProps>('div'))`
  --gap-v: 0rem;
  --gap-h: 0rem;
  
  position: relative;
  ${() => colSizeStyles.default}
  ${({ size }) => mapSize(size)}
  ${({ order }) => mapOrder(order)}
`

export default Object.assign(UiGrid, {
  Col,
})

type ColSize =
  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  | 'auto'
  | true

type ColSizeProp = ColSize | {
  [K in Breakpoint]?: ColSize
}

type Order = number | null | {
  [K in Breakpoint]?: Order
}

const mapSize = (size: ColSizeProp | undefined): any => {
  if (size === undefined || size === true) {
    return colSizeStyles.default
  }
  if (typeof size === 'number') {
    if (size === 0) {
      return colSizeStyles.none
    }
    return colSizeStyles.fixed[size - 1]
  }
  if (size === 'auto') {
    return colSizeStyles.auto
  }
  return Object.keys(size).map((breakpoint: Breakpoint) => css`
    ${Themed.media[breakpoint].min} {
      ${mapSize(size[breakpoint])}
    }
  `)
}

const mapOrder = (order: Order | null | undefined): any => {
  if (order == undefined) {
    return ''
  }
  if (typeof order === 'number') {
    return css`
      order: ${order};
    `
  }
  return Object.keys(order).map((breakpoint: Breakpoint) => css`
    ${Themed.media[breakpoint].min} {
      ${mapOrder(order[breakpoint])}
    }
  `)
}

const colSizeStyles = {
  default: css`
    display: block;
    flex-basis: 0;
    flex-grow: 1;
    max-width: calc(100% - var(--gap-h) * 2);
  `,
  auto: css`
    display: block;
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
  `,
  fixed: Array.from({ length: 12 }, (_, i) => {
    const percentage = 100 / 12 * (i + 1)
    return css`
      display: block;
      flex: 0 0 calc(${percentage}% - var(--gap-h) * 2);
      max-width: ${percentage}%;
    `
  }),
  none: css`
    display: none;
  `,
}