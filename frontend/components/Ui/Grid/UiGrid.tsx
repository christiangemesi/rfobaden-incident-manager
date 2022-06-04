import { StyledProps } from '@/utils/helpers/StyleHelper'
import { CSSProperties, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { Breakpoint, Themed } from '@/theme'
import { run } from '@/utils/control-flow'

interface Props extends StyledProps {
  /**
   * The horizontal and vertical gap between columns.
   * This is a factor that gets multiplied by `1rem`.
   */
  gap?: number

  /**
   * The horizontal gap between columns.
   * This is a factor that gets multiplied by `1rem`.
   */
  gapH?: number

  /**
   * The vertical gap between columns.
   * This is a factor that gets multiplied by `1rem`.
   */
  gapV?: number

  /**
   * Justifies the grid's contents.
   * This acts horizontally if the `direction` is `row`,
   * and vertically if the `direction` is `column`.
   */
  justify?: CSSProperties['justifyContent']

  /**
   * Aligns the grid's contents.
   * This acts vertically if the `direction` is `row`,
   * and horizontally if the `direction` is `column`.
   */
  align?: CSSProperties['alignItems']

  /**
   * The direction in which the columns are layed out.
   */
  direction?: CSSProperties['flexDirection']

  /**
   * The grid's columns.
   */
  children?: ReactNode
}

/**
 * `UiGrid` is a layout component that divides its contents into 12 evenly-sized columns.
 * The columns can be configured using {@link Col UiGrid.Col}.
 */
const UiGrid = styled.div<Props>`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  flex: 0 1 auto;
  flex-direction: ${({ direction }) => direction};
  width: 100%;

  justify-content: ${({ justify }) => justify};
  align-items: ${({ align }) => align};

  --gap-h: 0;
  --gap-v: 0;
  gap: var(--gap-v) var(--gap-h);
  
  ${({ gap = 0, gapH = gap, gapV = gap }) => css`
    --gap-h: ${gapH}rem;
    --gap-v: ${gapV}rem;
  `}
`

interface ColProps {
  /**
   * The size of the column.
   */
  size?: ColSizeProp

  /**
   * The order of the column.
   * A lower value will cause the column to appear after siblings with a higher order.
   */
  order?: Order

  /**
   * Sets the alignment of the column's text.
   */
  textAlign?: CSSProperties['textAlign']

  /**
   * The css classes applied to the column element.
   */
  className?: string

  /**
   * Inline styles applied to the column element.
   */
  style?: CSSProperties

  /**
   * The column's contents.
   */
  children?: ReactNode
}

/**
 * A column inside a {@link UiGrid}.
 */
const Col = styled.div<ColProps>`
  position: relative;
  // width: 100%;
  text-align: ${({ textAlign }) => textAlign};
  
  ${() => colSizeStyles.default}
  ${({ size }) => mapSize(size)}
  ${({ order }) => mapOrder(order)}
`

export default Object.assign(UiGrid, {
  Col,
})

/**
 * The definite size of a single column.
 * Can be either a number for a fixed size, `'auto'` for automatic sizing,
 * or `true` to take as much space as required and possible.
 */
type ColSize =
  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  | 'auto'
  | true

/**
 * The size of a column.
 * It is possible to use different sizes at different breakpoints.
 */
export type ColSizeProp = ColSize | {
  [K in Breakpoint]?: ColSize
}

/**
 * The order of a column.
 * It is possible to use different orders at different breakpoints.
 */
type Order = number | null | {
  [K in Breakpoint]?: number | null
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
    display: block;
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
  `,
  auto: css`
    display: block;
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
  `,
  fixed: Array.from({ length: 12 }, (_, i) => {
    // By default, `gap` and fixed size flex items don't work together at all: gap stays at its fixed size, and the
    // columns do too. This would mean that, for example, a grid with a non-zero gap and 3 fixed columns of size 4 would
    // not stay on one line - the gap fills up some of the first row, and thus push at least one column to the next row.
    // This is basically never the behaviour we want the grid to have, so we have to counteract this.
    //
    // The solution to keeping columns with a combined size of 12 on one line, even if a gap is set,
    // is to compute their width as follows:
    //   - Use the normal percentage as base value (e.g. size 4 => 33.333%).
    //   - Remove the full gap width from this value.
    //     This causes everything to be on one line, but leaves unused space at the end of each row.
    //     This unused space has the exact same size as the horizontal gap.
    //   - Distribute this unused space among all columns of a row.
    //     This is done by dividing the gap size through the ratio that the column is taking up,
    //     and adding the resulting value to the total width.
    //
    // Note that we can exclude full-width columns (size = 12) from this,
    // since they are only affected by the vertical gap,
    // while this countermeasure only deals with the horizontal gap.
    const basis = i == 11 ? '100%' : run(() => {
      const ratio = 12 / (i + 1)
      const percentage = (100 / ratio).toFixed(4)
      return css`
        calc(${percentage}% - var(--gap-h) + calc(var(--gap-h) / ${ratio}))
      `
    })
    return css`
      display: block;
      flex: 1 0 ${basis};
      width: 100%;
      max-width: ${basis};
    `
  }),
  none: css`
    display: none;
  `,
}
