import styled, { css } from 'styled-components'
import { ColorName } from '@/theme'

interface Props {
  color?: ColorName
}

const UiBanner = styled.div<Props>`
  padding: 1rem;
  
  ${({ theme, color = 'primary' }) => css`
    color: ${theme.colors[color].contrast};
    background-color: ${theme.colors[color].value};
  `}
`
export default UiBanner