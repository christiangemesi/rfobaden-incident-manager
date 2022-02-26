import Report from '@/models/Report'
import React, { useEffect } from 'react'
import styled, { useTheme } from 'styled-components'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiTextWithIcon from '@/components/Ui/TextWithIcon/UiTextWithIcon'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import TaskList from '@/components/Task/List/TaskList'
import TaskStore, { useTasksOfReport } from '@/stores/TaskStore'
import BackendService, { BackendResponse } from '@/services/BackendService'
import ReportStore from '@/stores/ReportStore'
import UiIconButtonGroup from '@/components/Ui/Icon/Button/Group/UiIconButtonGroup'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import { useUser } from '@/stores/UserStore'
import UiModal from '@/components/Ui/Modal/UiModal'
import { useIncident } from '@/stores/IncidentStore'
import ReportForm from '@/components/Report/Form/ReportForm'
import { useAsync } from 'react-use'
import Id from '@/models/base/Id'
import Task, { parseTask } from '@/models/Task'

interface Props {
  report: Report
}

const ReportView: React.VFC<Props> = ({ report }) => {
  const tasks = useTasksOfReport(report.id)
  const { loading: isLoading } = useAsync(async () => {
    if (loadedReports.has(report.id)) {
      return
    }
    const [tasks, error]: BackendResponse<Task[]> = await BackendService.list(
      `incidents/${report.incidentId}/reports/${report.id}/tasks`,
    )
    if (error !== null) {
      throw error
    }
    TaskStore.saveAll(tasks.map(parseTask))
    loadedReports.add(report.id)
  }, [report.id])

  const assignee = useUser(report.assigneeId)
  const assigneeName = assignee?.firstName + ' ' + assignee?.lastName ?? ''

  const handleDelete = async () => {
    if (confirm(`Sind sie sicher, dass sie die Meldung "${report.title}" löschen wollen?`)) {
      await BackendService.delete(`incidents/${report.incidentId}/reports`, report.id)

      ReportStore.remove(report.id)
    }
  }

  const startDate = report.startsAt !== null ? report.startsAt : report.createdAt

  const incident = useIncident(report.incidentId)
  if (incident === null) {
    throw new Error('incident of report not found')
  }

  return (
    <UiGrid gapV={1} direction="column" style={{ minHeight: '100%' }}>
      <UiGrid justify="space-between" align="center">
        <UiTitle level={3}>
          {report.title}
        </UiTitle>

        <UiIconButtonGroup>
          <UiIconButton onClick={() => alert('not yet implemented')}>
            <UiIcon.PrintAction />
          </UiIconButton>
          <UiModal isFull>
            <UiModal.Activator>{({ open }) => (
              <UiIconButton onClick={open}>
                <UiIcon.EditAction />
              </UiIconButton>
            )}</UiModal.Activator>
            <UiModal.Body>{({ close }) => (
              <React.Fragment>
                <UiTitle level={1} isCentered>
                  Meldung bearbeiten
                </UiTitle>
                <ReportForm incident={incident} report={report} onClose={close} />
              </React.Fragment>
            )}</UiModal.Body>
          </UiModal>

          <UiIconButton onClick={handleDelete}>
            <UiIcon.DeleteAction />
          </UiIconButton>
        </UiIconButtonGroup>
      </UiGrid>
      <UiDateLabel start={startDate} end={report.endsAt} />
      <TextLines>
        {report.description}
      </TextLines>

      {report.location && (
        <UiTextWithIcon text={report.location ?? ''}>
          <UiIcon.Location />
        </UiTextWithIcon>
      )}
      {assignee && (
        <UiTextWithIcon text={assigneeName}>
          <UiIcon.UserInCircle />
        </UiTextWithIcon>
      )}
      {report.notes !== null && (
        <UiTextWithIcon text={report.notes}>
          <UiIcon.AlertCircle />
        </UiTextWithIcon>
      )}

      <div>
        <TaskContainer>
          {isLoading ? (
            <UiIcon.Loader isSpinner />
          ) : (
            <TaskList
              incident={incident}
              report={report}
              tasks={tasks}
            />
          )}
        </TaskContainer>
      </div>
    </UiGrid>
  )
}
export default ReportView

const loadedReports = new Set<Id<Report>>()

const HorizontalSpacer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const VerticalSpacer = styled.div`
  width: 100%;
  margin-bottom: 1rem;

  :last-child {
    margin-bottom: 0;
  }
`

const BlockContainer = styled.div`
  width: 100%;
`

const TextLines = styled.div`
  white-space: pre-wrap;
  line-height: 1.2;
`

const TaskContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`