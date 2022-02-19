import Report from '@/models/Report'
import React from 'react'
import styled from 'styled-components'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiTextWithIcon from '@/components/Ui/TextWithIcon/UiTextWithIcon'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import TaskList from '@/components/Task/List/TaskList'
import { useTasksOfReport } from '@/stores/TaskStore'
import BackendService from '@/services/BackendService'
import ReportStore from '@/stores/ReportStore'
import UiIconButtonGroup from '@/components/Ui/Icon/Button/Group/UiIconButtonGroup'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import { useUser } from '@/stores/UserStore'
import UiModal from '@/components/Ui/Modal/UiModal'
import { useIncident } from '@/stores/IncidentStore'
import ReportForm from '@/components/Report/Form/ReportForm'

interface Props {
  report: Report
}

const ReportView: React.VFC<Props> = ({ report }) => {
  const assignee = useUser(report.assigneeId)
  const assigneeName = assignee?.firstName + ' ' + assignee?.lastName ?? ''

  const tasks = useTasksOfReport(report.id)

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
    <UiGrid gapH={2} gapV={1}>
      <VerticalSpacer>
        <UiTitle level={2}>
          {report.title}
        </UiTitle>
      </VerticalSpacer>
      <VerticalSpacer>
        <HorizontalSpacer>
          <UiDateLabel start={startDate} end={report.endsAt} />
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
        </HorizontalSpacer>
      </VerticalSpacer>
      <BlockContainer>
        <TextLines>
          {report.description}
        </TextLines>
      </BlockContainer>
      {report.location && (
        <BlockContainer>
          <UiTextWithIcon text={report.location ?? ''}>
            <UiIcon.Location />
          </UiTextWithIcon>
        </BlockContainer>
      )}
      {assignee && (
        <BlockContainer>
          <UiTextWithIcon text={assigneeName}>
            <UiIcon.UserInCircle />
          </UiTextWithIcon>
        </BlockContainer>
      )}
      {report.notes !== null && (
        <VerticalSpacer>
          <UiTextWithIcon text={report.notes}>
            <UiIcon.AlertCircle />
          </UiTextWithIcon>
        </VerticalSpacer>
      )}

      <BlockContainer>
        <TaskList
          incident={incident}
          report={report}
          tasks={tasks} />
      </BlockContainer>
    </UiGrid>
  )
}
export default ReportView

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