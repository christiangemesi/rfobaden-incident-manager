import Report, { parseReport } from '@/models/Report'
import React, { useCallback } from 'react'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import ReportForm from '@/components/Report/Form/ReportForm'
import BackendService, { BackendResponse } from '@/services/BackendService'
import ReportStore from '@/stores/ReportStore'
import Incident from '@/models/Incident'
import { FileId } from '@/models/FileUpload'
import TrackableCloseAction from '@/components/Trackable/Actions/TrackableCloseAction'
import TrackableEditAction from '@/components/Trackable/Actions/TrackableEditAction'
import TrackableFileUploadAction from '@/components/Trackable/Actions/TrackableFileUploadAction'
import UiPrinter from '@/components/Ui/Printer/UiPrinter'
import ReportPrintView from '@/components/Report/PrintView/ReportPrintView'
import BackendFetchService from '@/services/BackendFetchService'
import { loadCached } from '@/utils/hooks/useCachedEffect'
import TaskStore from '@/stores/TaskStore'

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

  const addImageId = useCallback((fileId: FileId) => {
    ReportStore.save({ ...report, imageIds: [...report.imageIds, fileId]})
  }, [report])

  const addDocumentId = useCallback((fileId: FileId) => {
    ReportStore.save({ ...report, documentIds: [...report.documentIds, fileId]})
  }, [report])

  const loadPrintData = useCallback(async () => {
    for (const task of TaskStore.list()) {
      if (task.reportId === report.id) {
        await loadCached('task/subtasks', task.id, async () => {
          await BackendFetchService.loadSubtasksOfTask(task)
        })
      }
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
        <TrackableEditAction title="Meldung bearbeiten">{({ close }) => (
          <ReportForm incident={incident} report={report} onClose={close} />
        )}</TrackableEditAction>

        {!report.isDone && (
          <TrackableCloseAction isClosed={report.isClosed} onClose={handleClose} onReopen={handleReopen} />
        )}

        <TrackableFileUploadAction
          id={report.id}
          modelName="report"
          onAddFile={addImageId}
          type="image"
        />
        <TrackableFileUploadAction
          id={report.id}
          modelName="report"
          onAddFile={addDocumentId}
          type="document"
        />

        <UiPrinter
          loadData={loadPrintData}
          renderContent={() => <ReportPrintView report={report} />}
        >
          {({ trigger }) => (
            <UiDropDown.Item onClick={trigger}>
              Drucken
            </UiDropDown.Item>
          )}
        </UiPrinter>

        <UiDropDown.Item onClick={handleDelete}>
          Löschen
        </UiDropDown.Item>
      </UiDropDown.Menu>
    </UiDropDown>
  )
}
export default ReportActions