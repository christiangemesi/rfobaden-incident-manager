import React, { EventHandler, MouseEvent, ReactNode } from 'react'
import styled from 'styled-components'
import UiButton, { Props as UiButtonProps } from '@/components/Ui/Button/UiButton'
import User from '@/models/User'

interface Props {
  onClick?: EventHandler<MouseEvent>
  children: ReactNode
}

const UiSortButton: React.VFC<Props> = ({ children, onClick: handleClick }) => {
  return (
    <SortButton onClick={handleClick}>
      {children}
    </SortButton>
  )
}
export default styled(UiSortButton)``

const SortButton = styled(UiButton)`
  background: transparent;
  border: transparent 1px solid;
  color: ${({ theme }) => theme.colors.tertiary.contrast};
  display: flex;
  justify-content: center;
  align-items: center;

  :hover {
    background-color: ${({ theme }) => theme.colors.grey.value};
  }
`
