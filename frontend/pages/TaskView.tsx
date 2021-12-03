import React, { useState } from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import styled from 'styled-components'
import Task from '@/models/TaskView'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiTextWithIcon from '@/components/Ui/TextWithIcon/UiTextWithIcon'
import User, { UserRole } from '@/models/User'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiItemWithDetails from '@/components/Ui/List/Element/UiItemWithDetails'
import UiList from '@/components/Ui/List/UiList'
import Priority from '@/models/Priority'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import UiCheckbox from '@/components/Ui/Checkbox/UiCheckbox'

const TaskView: React.VFC = () => {
  const task: Task = {
    id: 1,
    title: 'Absperrung Brücke',
    description: 'Baumstämme und Schutt bedrohen die alte Holzbücke am Limmatweg',
    priority: 'LOW',
    location: 'Baden',
    assigneeId: 1,

    createdAt: new Date(),
    updatedAt: new Date(),

    closedAt: new Date(),

    startsAt: new Date(),
    endsAt: new Date(),

    reportId: 1,
    incidentId: 1,
  }
  const user: { firstName: string; lastName: string; role: UserRole; email: string } = {
    email: 'Peter@Peter.usbekistan',
    firstName: 'Peter',
    lastName: 'Nachname',
    role: UserRole.ADMIN,

  }

  const [value, setValue] = useState(false)
  return (
    //TODO not assignable to type string?? line 53
    //TODO line 57
    <UiContainer>

      <UiTitle level={2}>
        {task.title} {<UiIcon.PriorityHigh />}
      </UiTitle>

      <UiTextWithIcon text={user.firstName + ' ' + user.lastName}>
        <UiIcon.UserInCircle />
      </UiTextWithIcon>

      <UiTextWithIcon text={task.location}>
        <UiIcon.Location />
      </UiTextWithIcon>

      <UiTitle level={6}>
        {task.description}
      </UiTitle>

      <UiTextWithIcon text={' PLATZHALTER ACHTUNG: starke Strömung und morsches Holz'}>
        <UiIcon.AlertCircle />
      </UiTextWithIcon>

      <UiGrid gap={0.5}>
        <UiGrid.Col size={6}>

          <UiList>
            <UiItemWithDetails priority={Priority.LOW} title={task.title} user={task.assigneeId}>
              <UiCheckbox label="CHECKBOX" value={value} onChange={setValue} />
            </UiItemWithDetails>

          </UiList>
        </UiGrid.Col>
      </UiGrid>

    </UiContainer>
  )
}
export default TaskView

const StyledName = styled.div`
  color: ${({ theme }) => theme.colors.error.value};
`
