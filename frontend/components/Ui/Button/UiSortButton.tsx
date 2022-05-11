import React, { ReactNode } from 'react'
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
      field.setDirection('asc')
      break
    case 'asc':
      field.setDirection('desc')
      break
    case 'desc':
      field.setDirection(null)
      break
    }
  }

  return (
    <SortButton onClick={handleSortClick}>
      {children}
      {field.direction === null ? <UiIcon.Empty /> : (
        field.direction === 'asc' ? <UiIcon.SortAsc /> : <UiIcon.SortDesc />
      )}
    </SortButton>
  )
}
export default styled(UiSortButton)``

const SortButton = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem;

  border: none;
  border-radius: 0.5rem;
  background: transparent;
  cursor: pointer;
  margin: 0 0.2rem;

  will-change: background-color;
  transition: 200ms ease-out;
  transition-property: background-color;

  :hover {
    background-color: ${({ theme }) => theme.colors.grey.value};
  }

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  color: ${({ theme }) => theme.colors.tertiary.contrast};
`