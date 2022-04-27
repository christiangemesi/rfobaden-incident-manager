import Incident from '@/models/Incident'
import React, { useMemo } from 'react'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import { useOrganizations } from '@/stores/OrganizationStore'
import { useSubtasks } from '@/stores/SubtaskStore'
import { useTasks } from '@/stores/TaskStore'
import { useReportsOfIncident } from '@/stores/ReportStore'
import UiCaptionList from '@/components/Ui/Caption/List/UiCaptionList'
import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import IncidentStore from '@/stores/IncidentStore'
import { FileId } from '@/models/FileUpload'
import ImageList from '@/components/Image/List/ImageList'
import ImageDrawer from '@/components/Image/Drawer/ImageDrawer'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiContainer from '@/components/Ui/Container/UiContainer'

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

  const storeImageIds = (ids: FileId[]) => {
    IncidentStore.save({ ...incident, imageIds: ids })
  }

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
      <ImageDrawer
        modelId={incident.id}
        modelName="incident"
        storeImageIds={storeImageIds}
        imageIds={incident.imageIds}
      >
        <UiCaption>
          {incident.imageIds.length}
          &nbsp;
          {incident.imageIds.length === 1 ? 'Bild' : 'Bilder'}
        </UiCaption>
      </ImageDrawer>
    </UiCaptionList>
  )
}
export default IncidentInfo