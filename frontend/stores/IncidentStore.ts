import { parseIncident } from '@/models/Incident'
import ReportStore from '@/stores/ReportStore'
import { createModelStore } from './base/Store'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'
import TransportStore from './TransportStore'

/**
 * `IncidentStore` manages all loaded {@link Incident incidents}.
 */
const IncidentStore = createModelStore(parseIncident, {
  sortBy: (incident) => [
    // Closed incidents are always at the bottom.
    [incident.isClosed, 'desc'],

    // Sort order: start date > end date
    incident.startsAt ?? incident.createdAt,
    incident.endsAt,
    incident.id,
  ],
})
export default IncidentStore

/**
 * `useIncident` is a React hook which loads a specific incident from {@link IncidentStore}.
 * It re-renders whenever the incident is changed.
 *
 * @param id The id of the incident.
 * @return The incident.
 */
export const useIncident = createUseRecord(IncidentStore)

/**
 * `useIncidents` is a React hook that loads all incidents from {@link IncidentStore}.
 * It re-renders whenever the store is modified.
 *
 * @param idsOrTransform? An list of ids to load, or a function that modifies the returned list.
 * @return The list of incidents.
 */
export const useIncidents = createUseRecords(IncidentStore)

ReportStore.onCreate((report) => {
  const incident = IncidentStore.find(report.incidentId)
  if (incident === null) {
    return
  }

  IncidentStore.save({
    ...incident,
    reportIds: [...new Set([...incident.reportIds, report.id])],
    closedReportIds:
      report.isClosed || report.isDone
        ? [...new Set([...incident.closedReportIds, report.id])]
        : incident.closedReportIds,
    isDone: incident.isDone && (report.isClosed || report.isDone),
  })
})

ReportStore.onUpdate((report) => {
  const incident = IncidentStore.find(report.incidentId)
  if (incident === null) {
    return
  }

  const closedReportIds = new Set(incident.closedReportIds)
  if (report.isClosed || report.isDone) {
    closedReportIds.add(report.id)
  } else {
    closedReportIds.delete(report.id)
  }

  IncidentStore.save({
    ...incident,
    closedReportIds: [...closedReportIds],
    isDone: closedReportIds.size === incident.reportIds.length,
  })
})

ReportStore.onRemove((report) => {
  const incident = IncidentStore.find(report.incidentId)
  if (incident === null) {
    return
  }

  const reportIds = [...incident.reportIds]
  reportIds.splice(reportIds.indexOf(report.id), 1)

  const closedReportIds = [...incident.closedReportIds]
  if (report.isClosed || report.isDone) {
    closedReportIds.splice(closedReportIds.indexOf(report.id), 1)
  }

  IncidentStore.save({
    ...incident,
    reportIds,
    closedReportIds,
    isDone: reportIds.length > 0 && reportIds.length === closedReportIds.length,
  })
})

TransportStore.onCreate((transport) => {
  const incident = IncidentStore.find(transport.incidentId)
  if (incident === null) {
    return
  }

  IncidentStore.save({
    ...incident,
    transportIds: [...new Set([...incident.transportIds, transport.id])],
    closedTransportIds: transport.isClosed
      ? [...new Set([...incident.closedTransportIds, transport.id])]
      : incident.closedTransportIds,
    isDone: incident.isDone && transport.isClosed,
  })
})

ReportStore.onUpdate((transport) => {
  const incident = IncidentStore.find(transport.incidentId)
  if (incident === null) {
    return
  }

  const closedTransportIds = new Set(incident.closedTransportIds)
  if (transport.isClosed) {
    closedTransportIds.add(transport.id)
  } else {
    closedTransportIds.delete(transport.id)
  }

  IncidentStore.save({
    ...incident,
    closedTransportIds: [...closedTransportIds],
    isDone: closedTransportIds.size === incident.transportIds.length,
  })
})

ReportStore.onRemove((transport) => {
  const incident = IncidentStore.find(transport.incidentId)
  if (incident === null) {
    return
  }

  const transportIds = [...incident.transportIds]
  transportIds.splice(transportIds.indexOf(transport.id), 1)

  const closedTransportIds = [...incident.closedTransportIds]
  if (transport.isClosed) {
    closedTransportIds.splice(closedTransportIds.indexOf(transport.id), 1)
  }

  IncidentStore.save({
    ...incident,
    transportIds,
    closedTransportIds,
    isDone: transportIds.length > 0 && transportIds.length === closedTransportIds.length,
  })
})
