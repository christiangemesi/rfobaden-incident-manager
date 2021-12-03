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
import { white } from 'colorette'
import UiActionButton from '@/components/Ui/Button/UiActionButton'

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
  const assignee: User = {
    id: 1,
    email: 'Peter@Peter.usbekistan',
    firstName: 'Peter',
    lastName: 'Nachname',
    role: UserRole.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const [value, setValue] = useState(false)
  return (
    <UiContainer>

      <UiTitle level={2}>
        {task.title} {<UiIcon.PriorityHigh />}
      </UiTitle>

      <UiTextWithIcon text={assignee.firstName + ' ' + assignee.lastName}>
        <UiIcon.UserInCircle />
      </UiTextWithIcon>

      {task.location !== null && (
        <UiTextWithIcon text={task.location ?? ''}>
          <UiIcon.Location />
        </UiTextWithIcon>
      )}

      <UiTitle level={6}>
        {task.description}
      </UiTitle>
      <StyledSpaceBeforeButton>
        <UiTextWithIcon text={' PLATZHALTER ACHTUNG: starke Strömung und morsches Holz'}>
          <UiIcon.AlertCircle />
        </UiTextWithIcon>
      </StyledSpaceBeforeButton>


      <UiGrid gap={0.5}>

        <UiGrid.Col size={6}>
          <StyledDiv>
            <div>{/*TODO fill in modal form instead of div*/}</div>
            <UiActionButton>
              <UiIcon.CreateAction />
            </UiActionButton>
          </StyledDiv>
        </UiGrid.Col>

        <UiGrid.Col size={6} />
        <UiGrid.Col size={6}>

          <UiList>
            <UiItemWithDetails priority={Priority.LOW} title={task.title}
              user={assignee.firstName + ' ' + assignee.lastName}>
              <UiCheckbox label="" value={value} onChange={setValue} color="tertiary" />
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

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledSpaceBeforeButton = styled.div`
  margin-bottom: 2rem;
`
