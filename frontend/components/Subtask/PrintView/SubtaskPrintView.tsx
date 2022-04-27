import Subtask from '@/models/Subtask'
import React from 'react'
import UiCaptionList from '@/components/Ui/Caption/List/UiCaptionList'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import { useUsername } from '@/models/User'
import { useUser } from '@/stores/UserStore'
import { useTask } from '@/stores/TaskStore'
import { useReport } from '@/stores/ReportStore'
import { useIncident } from '@/stores/IncidentStore'
import SubtaskListItem from '@/components/Subtask/List/Item/SubtaskListItem'

interface Props {
  subtask: Subtask
}

const SubtaskPrintView: React.VFC<Props> = ({ subtask }) => {
  const assigneeName = useUsername(useUser(subtask.assigneeId))

  const task = useTask(subtask.taskId)
  if (task === null) {
    throw new Error(`task not found: ${subtask.taskId}`)
  }

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
        {incident.title} / {report.title} / {task.title}
      </div>

      <UiCaptionList>
        <UiCaption isEmphasis>
          Teilauftrag
        </UiCaption>
        {assigneeName && (
          <UiCaption>
            {assigneeName}
          </UiCaption>
        )}
        <UiCaption>
          <UiDateLabel start={subtask.startsAt ?? subtask.createdAt} end={subtask.endsAt} />
        </UiCaption>
      </UiCaptionList>

      <SubtaskListItem task={task} subtask={subtask} />
    </div>
  )
}
export default SubtaskPrintView