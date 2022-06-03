import styled, { css } from 'styled-components'
import { ColorName, Themed } from '@/theme'

interface Props {
  color?: ColorName
}

const UiBanner = styled.div<Props>`
  padding: 0.5rem;
  font-size: ${({ theme }) => theme.fonts.sizes.small};
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  
  ${({ theme, color = 'primary' }) => css`
    background-color: ${theme.colors[color].value};
    color: ${({ theme }) => theme.colors[color].contrast};
  `}

  ${Themed.media.sm.max} {
    font-size: ${({ theme }) => (theme.fonts.sizes.smaller)};
  }

`
export default UiBanner