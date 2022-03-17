import Report, { parseReport } from '@/models/Report'
import React, { useCallback } from 'react'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiTitle from '@/components/Ui/Title/UiTitle'
import TaskForm from '@/components/Task/Form/TaskForm'
import ReportForm from '@/components/Report/Form/ReportForm'
import BackendService, { BackendResponse } from '@/services/BackendService'
import ReportStore from '@/stores/ReportStore'
import Incident from '@/models/Incident'

interface Props {
  incident: Incident
  report: Report
  onDelete?: () => void
}

const ReportActions: React.VFC<Props> = ({ incident, report, onDelete: handleDeleteCb }) => {
  const handleDelete = useCallback(async () => {
    if (confirm(`Sind sie sicher, dass sie die Meldung "${report.title}" löschen wollen?`)) {
      await BackendService.delete(`incidents/${report.incidentId}/reports`, report.id)
      if (handleDeleteCb) {
        handleDeleteCb()
      }
      ReportStore.remove(report.id)
    }
  }, [report, handleDeleteCb])

  const handleClose = useCallback(async () => {
    if (report.isDone) {
      alert('Es sind alle Aufträge geschlossen.')
      return
    }
    if (confirm(`Sind sie sicher, dass sie die Meldung "${report.title}" schliessen wollen?`)) {
      const newReport = { ...report, isClosed: true }
      const [data, error]: BackendResponse<Report> = await BackendService.update(`incidents/${report.incidentId}/reports`, report.id, newReport)
      if (error !== null) {
        throw error
      }
      ReportStore.save(parseReport(data))
    }
  }, [report])

  const handleReopen = useCallback(async () => {
    if (confirm(`Sind sie sicher, dass sie die Meldung "${report.title}" öffnen wollen?`)) {
      const newReport = { ...report, isClosed: false }
      const [data, error]: BackendResponse<Report> = await BackendService.update(`incidents/${report.incidentId}/reports`, report.id, newReport)
      if (error !== null) {
        throw error
      }
      ReportStore.save(parseReport(data))
    }
  }, [report])

  return (
    <UiDropDown>
      <UiDropDown.Trigger>{({ toggle }) => (
        <UiIconButton onClick={toggle}>
          <UiIcon.More />
        </UiIconButton>
      )}</UiDropDown.Trigger>
      <UiDropDown.Menu>

        <UiModal isFull>
          <UiModal.Activator>{({ open }) => (
            <UiDropDown.Item onClick={open}>
              Neuer Auftrag
            </UiDropDown.Item>
          )}</UiModal.Activator>
          <UiModal.Body>{({ close }) => (
            <div>
              <UiTitle level={1} isCentered>
                Auftrag erfassen
              </UiTitle>
              <TaskForm report={report} onClose={close} />
            </div>
          )}</UiModal.Body>
        </UiModal>

        <UiModal isFull>
          <UiModal.Activator>{({ open }) => (
            <UiDropDown.Item onClick={open}>
              Bearbeiten
            </UiDropDown.Item>
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
        {!report.isDone && (
          report.isClosed ? (
            <UiDropDown.Item onClick={handleReopen}>
              Öffnen
            </UiDropDown.Item>
          ) : (
            <UiDropDown.Item onClick={handleClose}>
              Schliessen
            </UiDropDown.Item>
          )
        )}

        <UiDropDown.Item onClick={handleDelete}>
          Löschen
        </UiDropDown.Item>
      </UiDropDown.Menu>
    </UiDropDown>
  )
}
export default ReportActions