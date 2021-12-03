import Report from '@/models/Report'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiTextWithIcon from '@/components/Ui/TextWithIcon/UiTextWithIcon'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import TaskList from '@/components/Task/List/TaskList'
import { useTasksOfReport } from '@/stores/TaskStore'
import BackendService from '@/services/BackendService'
import * as ReactDOM from 'react-dom'
import ReportView from '@/components/Report/View/ReportView'
import ReportStore from '@/stores/ReportStore'
import UiIconButtonGroup from '@/components/Ui/Icon/Button/Group/UiIconButtonGroup'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import { useUser } from '@/stores/UserStore'
import UiModal from '@/components/Ui/Modal/UiModal'
import ReportForm from '@/components/Report/Form/ReportForm'
import { useIncident } from '@/stores/IncidentStore'

interface Props {
  report: Report
}

const ReportItem: React.VFC<Props> = ({ report }) => {
  const assignee = useUser(report.assigneeId)
  const assigneeName = assignee?.firstName + ' ' + assignee?.lastName ?? ''

  const tasks = useTasksOfReport(report.id)

  // TODO check if working
  const [printer, setPrinter] = useState<ReactNode>()
  const handlePrint = () => {
    const Printer: React.VFC = () => {
      const ref = useRef<HTMLDivElement | null>(null)
      useEffect(() => {
        window.print()
        setPrinter(undefined)
      }, [ref])
      return <ReportView innerRef={ref} report={report} />
    }
    setPrinter(ReactDOM.createPortal((
      <div id="print-only" style={{ margin: '4rem' }}>
        <Printer />
      </div>
    ), document.body))
  }

  const handleDelete = async () => {
    if (confirm(`Sind sie sicher, dass sie die Meldung "${report.title}" schliessen wollen?`)) {
      await BackendService.delete(`incidents/${report.incidentId}/reports`, report.id)
      ReportStore.remove(report.id)
    }
  }

  const startDate = report.startsAt !== null ? report.startsAt : report.createdAt

  const incident = useIncident(report.incidentId)

  return (
    <UiGrid gapH={2} gapV={1}>
      <UiGrid.Col size={12}>
        <UiTitle level={2}>
          {report.title}
        </UiTitle>
      </UiGrid.Col>
      <UiGrid.Col size={12}>
        <StyledDiv>
          <StyledP>
            <UiDateLabel start={startDate} end={report.endsAt} type={'datetime'} />
          </StyledP>
          <UiIconButtonGroup>
            <UiIconButton onClick={handlePrint}>
              <UiIcon.PrintAction />
              {printer}
            </UiIconButton>
            {incident !== null && (
              <UiModal isFull>
                <UiModal.Activator>{({ open }) => (
                  <UiIconButton onClick={open}>
                    <UiIcon.EditAction />
                  </UiIconButton>
                )}</UiModal.Activator>
                <UiModal.Body>{({ close }) => (
                  <UiGrid gapV={1.5}>
                    <UiGrid.Col size={12}>
                      <UiTitle level={1} isCentered>
                        Meldung bearbeiten
                      </UiTitle>
                    </UiGrid.Col>
                    <UiGrid.Col size={12}>
                      <ReportForm incident={incident} report={report} onClose={close} />
                    </UiGrid.Col>
                  </UiGrid>
                )}</UiModal.Body>
              </UiModal>
            )}
            <UiIconButton onClick={handleDelete}>
              <UiIcon.DeleteAction />
            </UiIconButton>
          </UiIconButtonGroup>
        </StyledDiv>
      </UiGrid.Col>
      <UiGrid.Col size={12}>
        {report.description}
      </UiGrid.Col>
      <UiGrid.Col size={12}>
        <UiTextWithIcon text={report.location ?? ''}>
          <UiIcon.Location />
        </UiTextWithIcon>
      </UiGrid.Col>
      <UiGrid.Col size={12}>
        <UiTextWithIcon text={assigneeName}>
          <UiIcon.UserInCircle />
        </UiTextWithIcon>
      </UiGrid.Col>
      {report.notes !== null ?
        <UiGrid.Col size={12}>
          <UiTextWithIcon text={report.notes}>
            <UiIcon.AlertCircle />
          </UiTextWithIcon>
        </UiGrid.Col> :
        ''
      }
      <UiGrid.Col size={12}>
        <TaskList tasks={tasks} />
      </UiGrid.Col>
    </UiGrid>
  )
}
export default ReportItem

const StyledP = styled.p`
  margin-bottom: 2rem;

  :last-child {
    margin-bottom: 0;
  }
`

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;

`
