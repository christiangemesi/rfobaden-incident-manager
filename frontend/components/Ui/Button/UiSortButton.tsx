import React from 'react'
import styled from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import { SortField } from '@/utils/hooks/useSort'
import UiListHeader, { ListHeaderProps } from '@/components/Ui/List/UiListHeader'

interface Props extends ListHeaderProps {
  field: SortField
}

const UiSortButton: React.VFC<Props> = ({
  children,
  field,
  ...props
}) => {
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
    <SortButton {...props} onClick={handleSortClick}>
      {children}
      {field.direction === null ? <UiIcon.Empty /> : (
        field.direction === 'asc' ? <UiIcon.SortAsc /> : <UiIcon.SortDesc />
      )}
    </SortButton>
  )
}
export default styled(UiSortButton)``

const SortButton = styled(UiListHeader)`
  cursor: pointer;
  margin: 0 0.2rem;
  padding: 0.5rem;
  color: ${({ theme }) => theme.colors.tertiary.contrast};

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
`
