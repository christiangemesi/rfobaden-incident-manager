import React from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiTitle from '@/components/Ui/Title/UiTitle'
import styled, { css } from 'styled-components'
import { Themed } from '@/theme'

const MediaQueriesExample: React.VFC = () => {
  return (
    <UiContainer>
      <UiTitle level={1}>
        Custom Grid
      </UiTitle>

      <Grid>
        <Column xs={12} md={0} lg={6}>
          1
        </Column>
        <Column xs={12} lg={4}>
          2
        </Column>
        <Column xs={12} sm={6} lg={2}>
          3
        </Column>
        <Column xs={12} xxl={6}>
          4
        </Column>
        <Column xs={12} xl={6}>
          5
        </Column>
      </Grid>
    </UiContainer>
  )
}
export default MediaQueriesExample


const Grid = styled.div`
  // Simple grid layout with 12 columns.
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  
  // Add a gap between the elements so we can clearly separate them visually.
  grid-gap: 0.5rem;
`

const Column = styled.div<ColumnProps>`
  // Basic column styling - used only so it looks alright.
  // Has nothing to do with the actual grid functionality.
  display: flex;
  border: 1px solid black;
  width: 1fr;
  height: 2rem;
  justify-content: center;
  align-items: center;
  
  // Use xs as default.
  grid-column: auto / span ${({ xs }) => xs};
  
  // If size for sm exists, then use that size starting from that breakpoint.
  ${({ sm }) => sm !== undefined && css`
    ${Themed.media.sm.min} {
      grid-column: auto / span ${sm};
    }
  `}
  
  // If size for md exists, then use that size starting from that breakpoint.
  ${({ md }) => md !== undefined && css`
    ${Themed.media.md.min} {
      grid-column: auto / span ${md};
    }
  `}
  
  // If size for lg exists, then use that size starting from that breakpoint.
  ${({ lg }) => lg !== undefined && css`
    ${Themed.media.lg.min} {
      grid-column: auto / span ${lg};
    }
  `}

  // If size for xl exists, then use that size starting from that breakpoint.
  ${({ xl }) => xl !== undefined && css`
    ${Themed.media.xl.min} {
      grid-column: auto / span ${xl};
    }
  `}

  // If size for xxl exists, then use that size starting from that breakpoint.
  ${({ xxl }) => xxl !== undefined && css`
    ${Themed.media.xxl.min} {
      grid-column: auto / span ${xxl};
    }
  `}
`

interface ColumnProps {
  xs: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  xxl?: number
}
