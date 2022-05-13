import Task from '@/models/Task'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import TaskInfo from '@/components/Task/Info/TaskInfo'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiIconButtonGroup from '@/components/Ui/Icon/Button/Group/UiIconButtonGroup'
import TaskActions from '@/components/Task/Actions/TaskActions'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiDescription from '@/components/Ui/Description/UiDescription'
import React from 'react'
import Report from '@/models/Report'
import UiPriority from '@/components/Ui/Priority/UiPriority'
import styled from 'styled-components'
import ReportInfo from '@/components/Report/Info/ReportInfo'

interface Props {
  report: Report
  task: Task
  hasPriority?: boolean
  onClose?: () => void
}

const TaskViewHeader: React.VFC<Props> = ({
  report,
  task,
  hasPriority = false,
  onClose: handleClose,
}) => {
  return (
    <Container>
      <UiGrid justify="space-between" align="start" gap={1}>
        <UiGrid.Col>
          <TaskInfo task={task} />
        </UiGrid.Col>
        <UiGrid.Col size="auto" textAlign="right">
          <UiIconButtonGroup>
            <TaskActions report={report} task={task} />
            <UiIconButton onClick={handleClose}>
              <UiIcon.CancelAction />
            </UiIconButton>
          </UiIconButtonGroup>
        </UiGrid.Col>
      </UiGrid>
      <TitleContainer>
        {hasPriority && (
          <UiPriority priority={report.priority} />
        )}
        <div style={{ width: '100%' }}>
          <UiTitle level={3}>
            {task.title}
          </UiTitle>
        </div>
      </TitleContainer>
      <UiDescription description={task.description} />
    </Container>
  )
}
export default TaskViewHeader

const Container = styled.div`
  display: flex;
  flex-direction: column;
  //gap: 1rem;
`

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  //gap: 1rem;
`