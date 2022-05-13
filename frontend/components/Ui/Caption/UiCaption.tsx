import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'

interface Props extends StyledProps {
  isEmphasis?: boolean
  children: ReactNode
  onClick?: () => void
}

const UiCaption: React.VFC<Props> = (props) => {
  return <Caption {...props} />
}
export default styled(UiCaption)``

const Caption = styled.div<{ isEmphasis?: boolean, onClick?: () => void }>`
  font-size: ${({ theme }) => theme.fonts.sizes.small};
  opacity: 0.7;
  transition: ease 100ms;
  transition-property: transform;
  
  ${({ onClick }) => onClick !== undefined  && css`
    :hover {
      cursor: pointer;
      transform: scale(1.1);
    }
  `}

  ${({ isEmphasis }) => isEmphasis && css`
    font-weight: bold;
  `}
`
