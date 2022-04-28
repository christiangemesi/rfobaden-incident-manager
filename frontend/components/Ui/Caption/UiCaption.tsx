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
  font-size: 0.9em;
  opacity: 0.7;

  ${({ onClick }) => onClick !== undefined && css`
    :hover {
      cursor: pointer;
    }
  `}

  ${({ isEmphasis }) => isEmphasis && css`
    font-weight: bold;
  `}
`
