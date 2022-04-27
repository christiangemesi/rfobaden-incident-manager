import React from 'react'
import { useReport } from '@/stores/ReportStore'
import { useIncident } from '@/stores/IncidentStore'
import Task from '@/models/Task'
import { useSubtasksOfTask } from '@/stores/SubtaskStore'
import SubtaskPrintView from '@/components/Subtask/PrintView/SubtaskPrintView'
import styled, { css } from 'styled-components'
import TaskViewHeader from '@/components/Task/View/Header/TaskViewHeader'

interface Props {
  task: Task
  isNested?: boolean
}

const TaskPrintView: React.VFC<Props> = ({ task, isNested = false }) => {
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
      {isNested || (
        <div style={{ marginBottom: '1rem' }}>
          {incident.title} / {report.title}
        </div>
      )}

      <TaskViewHeader report={report} task={task} />

      <Content isNested={isNested}>
        {subtasks.map((subtask) => (
          <SubtaskPrintView key={subtask.id} subtask={subtask} noPath />
        ))}
      </Content>
    </div>
  )
}
export default TaskPrintView

const Content = styled.div<{ isNested: boolean }>`
  margin-top: 1rem;
  ${({ isNested }) => isNested && css`
    margin-left: 2rem;
  `}
`
