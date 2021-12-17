import Subtask from '@/models/Subtask'
import React, { useState } from 'react'
import { useUser } from '@/stores/UserStore'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import Priority from '@/models/Priority'
import UiCheckbox from '@/components/Ui/Checkbox/UiCheckbox'
import styled, { css } from 'styled-components'

interface Props {
  subtask: Subtask,
  isActive: boolean,
  onClick?: (Subtask: Subtask) => void,
}

const SubtaskListItem: React.VFC<Props> = ({
  subtask,
  isActive,
  onClick: handleClick }) => {

  const assignee = useUser(subtask.assigneeId)
  const assigneeName = assignee?.firstName + ' ' + assignee?.lastName ?? ''

  const [value, setValue] = useState(false)

  return (
    <SelectableListItem
      isActive={isActive}
      priority={Priority.LOW}
      title={subtask.title}
      user={assigneeName}
      onClick={handleClick && ( () => handleClick(subtask))}>
      <UiCheckbox label="" value={value} onChange={setValue} color="tertiary" />
    </SelectableListItem>
  )
}

export default SubtaskListItem

const SelectableListItem = styled(UiListItemWithDetails)<{ isActive: boolean }>`
  ${({ isActive, theme }) => isActive && css`
    background: ${theme.colors.secondary.contrast};
    color: ${theme.colors.secondary.value};
  `}
`
