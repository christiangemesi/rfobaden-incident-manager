import React, { EventHandler, MouseEvent, ReactNode, useState } from 'react'
import styled from 'styled-components'
import UiButton, { Props as UiButtonProps } from '@/components/Ui/Button/UiButton'
import User from '@/models/User'
import UiIcon from '@/components/Ui/Icon/UiIcon'

interface Props {
  onClick: (direction: 'asc' | 'desc') => void
  children: ReactNode
}

const UiSortButton: React.VFC<Props> = ({ children, onClick: handleClick }) => {
  const [direction, setDirection] = useState<null | 'asc' | 'desc'>(null)
  const handleSortClick = () => {
    switch (direction) {
    case null:
    case 'desc':
      setDirection('asc')
      handleClick('asc')
      break
    case 'asc':
      setDirection('desc')
      handleClick('desc')
      break
    }
  }
 
  return (
    <SortButton onClick={handleSortClick}>
      {direction !== null && (
        direction === 'asc' ? <UiIcon.SortAsc /> : <UiIcon.SortDesc />
      )}
      {children}
    </SortButton>
  )
}
export default styled(UiSortButton)``

const SortButton = styled.div`
  background: transparent;
  border: transparent 1px solid;
  color: ${({ theme }) => theme.colors.tertiary.contrast};
  display: inline-flex;
  justify-content: center;
  align-items: center;

  :hover {
    background-color: ${({ theme }) => theme.colors.grey.value};
  }
`
