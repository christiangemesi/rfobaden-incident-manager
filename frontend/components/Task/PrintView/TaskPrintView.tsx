import React from 'react'
import { useUsername } from '@/models/User'
import { useUser } from '@/stores/UserStore'
import { useReport } from '@/stores/ReportStore'
import { useIncident } from '@/stores/IncidentStore'
import Task from '@/models/Task'
import { useSubtasksOfTask } from '@/stores/SubtaskStore'
import SubtaskPrintView from '@/components/Subtask/PrintView/SubtaskPrintView'
import styled from 'styled-components'
import TaskViewHeader from '@/components/Task/View/Header/TaskViewHeader'

interface Props {
  task: Task
}

const TaskPrintView: React.VFC<Props> = ({ task }) => {
  const assigneeName = useUsername(useUser(task.assigneeId))

  const subtasks = useSubtasksOfTask(task.id)

  const report = useReport(task.reportId)
  if (report === null) {
    throw new Error(`report not found: ${task.reportId}`)
  }

  const incident = useIncident(report.incidentId)
  if (incident === null) {
    throw new Error(`incident not found: ${report.incidentId}`)
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        {incident.title} / {report.title}
      </div>

      <TaskViewHeader report={report} task={task} />

      <Content>
        {subtasks.map((subtask) => (
          <SubtaskPrintView key={subtask.id} subtask={subtask} noPath />
        ))}
      </Content>
    </div>
  )
}
export default TaskPrintView

const Content = styled.div`
  margin-top: 1rem;
`