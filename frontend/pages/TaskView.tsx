import React from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import styled from 'styled-components'
import Task from '@/models/TaskView'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiTextWithIcon from '@/components/Ui/TextWithIcon/UiTextWithIcon'
import User, { UserRole } from '@/models/User'

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

  return (
    <div>
      <UiTitle level={1}>
        {task.title} {<UiIcon.PriorityHigh />}
      </UiTitle>

      <UiTextWithIcon text={user.firstName + ' '+ user.lastName}>
        <UiIcon.Organization />
      </UiTextWithIcon>

      <UiTextWithIcon text={task.location}>
        <UiIcon.LocationRelevancy />
      </UiTextWithIcon>

      <UiTitle level={6}>
        {task.description}
      </UiTitle>

      <UiTextWithIcon text={' PLATZHALTER ACHTUNG: starke Strömung und morsches Holz'}>
        <UiIcon.Attachments />
      </UiTextWithIcon>



    </div>
  )
}
export default TaskView

const StyledName = styled.div`
  color: ${({ theme }) => theme.colors.error.value};
`
