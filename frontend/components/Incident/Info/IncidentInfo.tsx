import Incident from '@/models/Incident'
import React, { useCallback, useMemo } from 'react'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import { useOrganizations } from '@/stores/OrganizationStore'
import { useSubtasks } from '@/stores/SubtaskStore'
import { useTasks } from '@/stores/TaskStore'
import { useReportsOfIncident } from '@/stores/ReportStore'
import UiCaptionList from '@/components/Ui/Caption/List/UiCaptionList'
import IncidentStore from '@/stores/IncidentStore'
import Document from '@/models/Document'
import DocumentImageDrawer from '@/components/Document/Image/Drawer/DocumentImageDrawer'
import DocumentDrawer from '@/components/Document/Drawer/DocumentDrawer'
import UiLink from '@/components/Ui/Link/UiLink'
import styled from 'styled-components'

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

  const storeImages = (images: Document[]) => {
    IncidentStore.save({ ...incident, images: images })
  }

  const storeDocuments = (documents: Document[]) => {
    IncidentStore.save({ ...incident, documents: documents })
  }

  const addImage = useCallback((image: Document) => {
    IncidentStore.save({ ...incident, images: [...incident.images, image]})
  }, [incident])

  const addDocument = useCallback((document: Document) => {
    IncidentStore.save({ ...incident, documents: [...incident.documents, document]})
  }, [incident])

  return (
    <UiCaptionList>
      <UiCaption isEmphasis>
        <BackButton href="/ereignisse">Ereignis</BackButton>
      </UiCaption>
      <UiCaption>
        {activeOrganisations.length}
        &nbsp;
        {activeOrganisations.length === 1 ? 'Organisation' : 'Organisationen'}
      </UiCaption>
      <UiCaption>
        <UiDateLabel start={incident.startsAt ?? incident.createdAt} end={incident.endsAt} />
      </UiCaption>

      <DocumentImageDrawer
        images={incident.images}
        storeImages={storeImages}
        modelId={incident.id}
        modelName="incident"
        onAddImage={addImage}
      />
      <DocumentDrawer
        documents={incident.documents}
        storeDocuments={storeDocuments}
        modelId={incident.id}
        modelName="incident"
        onAddDocument={addDocument}
      />
    </UiCaptionList>
  )
}
export default IncidentInfo

const BackButton = styled(UiLink)`
  color: ${({ theme }) => theme.colors.secondary.contrast};
`