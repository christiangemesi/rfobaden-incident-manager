import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'

interface Props extends StyledProps {

  /**
   * Sets the caption to be bold.
   */
  isEmphasis?: boolean

  /**
   * The component to be styled as caption.
   */
  children: ReactNode

  /**
   * Event caused by clicking on the {@link UiCaption}.
   */
  onClick?: () => void
}

/**
 * `UiCaption` is a wrapper to style a component as a caption.
 */
const UiCaption: React.VFC<Props> = (props) => {
  return <Caption {...props} />
}
export default styled(UiCaption)``

const Caption = styled.div<{ isEmphasis?: boolean, onClick?: () => void }>`
  font-size: ${({ theme }) => theme.fonts.sizes.small};
  opacity: 0.7;
  
  ${({ onClick }) => onClick !== undefined  && css`
    :hover {
      cursor: pointer;
      text-decoration: underline;
    }
  `}

  ${({ isEmphasis }) => isEmphasis && css`
    font-weight: bold;
  `}
`
