import Incident from '@/models/Incident'
import React, { useMemo } from 'react'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import { useOrganizations } from '@/stores/OrganizationStore'
import { useSubtasks } from '@/stores/SubtaskStore'
import { useTasks } from '@/stores/TaskStore'
import { useReportsOfIncident } from '@/stores/ReportStore'
import UiCaptionList from '@/components/Ui/Caption/List/UiCaptionList'
import UiModal from '@/components/Ui/Modal/UiModal'
import Image from 'next/image'
import { getImageUrl } from '@/models/FileUpload'

interface Props {
  incident: Incident
}

const IncidentInfo: React.VFC<Props> = ({ incident }) => {
  const reports = useReportsOfIncident(incident.id)

  const tasks = useTasks((tasks) => (
    tasks.filter((task) => task.incidentId === incident.id)
  ))

  const subtasks = useSubtasks((subtasks) => (
    subtasks.filter((subtask) => subtask.incidentId === incident.id)
  ))


  const assigneeIds = useMemo(() => new Set([
    ...reports.map((report) => report.assigneeId),
    ...tasks.map((task) => task.assigneeId),
    ...subtasks.map((subtask) => subtask.assigneeId),
  ]), [reports, tasks, subtasks])

  const activeOrganisations = useOrganizations((organizations) => (
    organizations
      .filter(({ userIds }) => userIds.some((id) => assigneeIds.has(id)))
      .map(({ name }) => name)
  ), [assigneeIds])

  return (
    <UiCaptionList>
      <UiCaption isEmphasis>
        Ereignis
      </UiCaption>
      <UiCaption>
        {activeOrganisations.length}
        &nbsp;
        {activeOrganisations.length === 1 ? 'Organisation' : 'Organisationen'}
      </UiCaption>
      <UiCaption>
        <UiDateLabel start={incident.startsAt ?? incident.createdAt} end={incident.endsAt} />
      </UiCaption>
      <UiModal>
        <UiModal.Activator>{({ open }) => (
          <UiCaption onClick={open}>
            {incident.imageIds.length}
            &nbsp;
            {activeOrganisations.length === 1 ? 'Bild' : 'Bilder'}
          </UiCaption>
        )}</UiModal.Activator>
        <UiModal.Body>
          <h1>Bilder</h1>
          <Image src={getImageUrl(incident.imageIds[0])} width={100} height={100} alt="Kein Bild" />
        </UiModal.Body>
      </UiModal>
    </UiCaptionList>
  )
}
export default IncidentInfo
