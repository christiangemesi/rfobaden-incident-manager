import StyleHelper, { StyledProps } from '@/utils/helpers/StyleHelper'
import { CSSProperties, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { Breakpoint, Themed } from '@/theme'

interface Props extends StyledProps {
  gap?: number
  gapH?: number
  gapV?: number
  justify?: CSSProperties['justifyContent']
  align?: CSSProperties['alignItems']
  children?: ReactNode
}

const UiGrid = styled(StyleHelper.tag<Props>('div'))`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  justify-content: ${({ justify }) => justify};
  align-items: ${({ align }) => align};

  --gap-h: 0;
  --gap-v: 0;
  margin: calc(var(--gap-v) * -1) calc(var(--gap-h) * -1);
  padding: 0;
  
  ${({ gap = 1, gapH = gap, gapV = gap }) => css`
    --gap-h: ${gapH * 0.5}rem;
    --gap-v: ${gapV * 0.5}rem;
  `}
`

interface ColProps {
  size?: ColSizeProp
  order?: Order
  textAlign?: CSSProperties['textAlign']
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

const Col = styled(StyleHelper.tag<ColProps>('div'))`
  position: relative;
  display: block;
  width: 100%;
  padding: var(--gap-v) var(--gap-h);
  text-align: ${({ textAlign }) => textAlign};


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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
  `,
  auto: css`
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
  `,
  fixed: Array.from({ length: 12 }, (_, i) => {
    const percentage = 100 / 12 * (i + 1)
    return css`
      flex: 0 0 ${percentage}%;
      max-width: ${percentage}%;
    `
  }),
  none: css`
    display: none;
  `,
}
