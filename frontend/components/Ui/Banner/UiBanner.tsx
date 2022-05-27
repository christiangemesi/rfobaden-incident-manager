import styled, { css } from 'styled-components'
import { ColorName } from '@/theme'

interface Props {
  color?: ColorName
}

const UiBanner = styled.div<Props>`
  padding: 1rem;
  font-size: ${({ theme }) => theme.fonts.sizes.small};
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  
  ${({ theme, color = 'primary' }) => css`
    background-color: ${theme.colors[color].value};
    color: ${({ theme }) => theme.colors[color].contrast};
  `}
`
export default UiBanner