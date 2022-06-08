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

/*
 * After a report creation the incident needs to update the `reportIds`, `closedReportIds` and `isDone`.
 */
ReportStore.onCreate((report) => {
  const incident = IncidentStore.find(report.incidentId)
  if (incident === null) {
    return
  }

  // Update number of key reports
  let numberOfKeyReports = incident.numberOfKeyReports
  if (report.isKeyReport) {
    numberOfKeyReports++
  }

  // Save the new report in reportIds and if necessary adjust closedReportIds and isDone.
  IncidentStore.save({
    ...incident,
    numberOfKeyReports,
    reportIds: [...new Set([...incident.reportIds, report.id])],
    closedReportIds:
      report.isClosed || report.isDone
        ? [...new Set([...incident.closedReportIds, report.id])]
        : incident.closedReportIds,
    isDone: incident.isDone && (report.isClosed || report.isDone),
  })
})

/*
 * After a report update the incident needs to update the `closedReportIds` and `isDone`.
 */
ReportStore.onUpdate((report, oldReport) => {
  const incident = IncidentStore.find(report.incidentId)
  if (incident === null) {
    return
  }

  // Update number of key reports
  let numberOfKeyReports = incident.numberOfKeyReports
  if (report.isKeyReport && !oldReport.isKeyReport) {
    numberOfKeyReports++
  } else if (!report.isKeyReport && oldReport.isKeyReport) {
    numberOfKeyReports--
  }

  // Add/remove the updated report to/from closedReportIds.
  const closedReportIds = new Set(incident.closedReportIds)
  if (report.isClosed || report.isDone) {
    closedReportIds.add(report.id)
  } else {
    closedReportIds.delete(report.id)
  }

  IncidentStore.save({
    ...incident,
    numberOfKeyReports,
    closedReportIds: [...closedReportIds],
    isDone: closedReportIds.size === incident.reportIds.length,
  })
})

/*
 * After a report deletion the incident needs to update the `reportIds`, `closedReportIds` and `isDone`.
*/
ReportStore.onRemove((report) => {
  const incident = IncidentStore.find(report.incidentId)
  if (incident === null) {
    return
  }

  // Update number of key reports
  let numberOfKeyReports = incident.numberOfKeyReports
  if (report.isKeyReport) {
    numberOfKeyReports--
  }

  // Remove the deleted report from reportIds and closedReportIds.
  const reportIds = [...incident.reportIds]
  reportIds.splice(reportIds.indexOf(report.id), 1)

  const closedReportIds = [...incident.closedReportIds]
  if (report.isClosed || report.isDone) {
    closedReportIds.splice(closedReportIds.indexOf(report.id), 1)
  }

  IncidentStore.save({
    ...incident,
    numberOfKeyReports,
    reportIds,
    closedReportIds,
    isDone: reportIds.length > 0 && reportIds.length === closedReportIds.length,
  })
})

/*
 * After a transport creation the incident needs to update the `transportIds`, `closedTransportIds` and `isDone`.
 */
TransportStore.onCreate((transport) => {
  const incident = IncidentStore.find(transport.incidentId)
  if (incident === null) {
    return
  }

  // Save the new transport in transportIds and if necessary adjust closedTransportIds and isDone.
  IncidentStore.save({
    ...incident,
    transportIds: [...new Set([...incident.transportIds, transport.id])],
    closedTransportIds: transport.isClosed
      ? [...new Set([...incident.closedTransportIds, transport.id])]
      : incident.closedTransportIds,
    isDone: incident.isDone && transport.isClosed,
  })
})

/*
 * After a transport update the incident needs to update the `closedTransportIds` and `isDone`.
 */
TransportStore.onUpdate((transport) => {
  const incident = IncidentStore.find(transport.incidentId)
  if (incident === null) {
    return
  }

  // Add/remove the updated transport to/from closedTransportIds.
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

/*
 * After a transport deletion the incident needs to update the `transportIds`, `closedTransportIds` and `isDone`.
*/
TransportStore.onRemove((transport) => {
  const incident = IncidentStore.find(transport.incidentId)
  if (incident === null) {
    return
  }

  // Remove the deleted transport from transportIds and closedTransportIds.
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
