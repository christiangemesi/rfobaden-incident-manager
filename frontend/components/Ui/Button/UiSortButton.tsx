import React, { ReactNode, useState } from 'react'
import styled from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import { SortField } from '@/utils/hooks/useSort'

interface Props {
  field: SortField
  children: ReactNode
}

const UiSortButton: React.VFC<Props> = ({ children, field }) => {
  const handleSortClick = () => {
    switch (field.direction) {
    case null:
    case 'desc':
      field.setDirection('asc')
      break
    case 'asc':
      field.setDirection('desc')
      break
    }
  }
 
  return (
    <SortButton onClick={handleSortClick}>
      {field.direction !== null && (
        field.direction === 'asc' ? <UiIcon.SortAsc /> : <UiIcon.SortDesc />
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
