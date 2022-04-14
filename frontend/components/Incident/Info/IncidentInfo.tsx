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
import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import UiButton from '@/components/Ui/Button/UiButton'
import UiTitle from '@/components/Ui/Title/UiTitle'
import styled from 'styled-components'
import { ColorName } from '@/theme'

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
      <UiDrawer size="full">
        <UiDrawer.Trigger>{({ open }) => (
          <UiCaption onClick={open}>
            {incident.imageIds.length}
            &nbsp;
            {incident.imageIds.length === 1 ? 'Bild' : 'Bilder'}
          </UiCaption>
        )}</UiDrawer.Trigger>
        <UiDrawer.Body>
          <UiTitle level={1}>
            Bilder
          </UiTitle>
          <ImageContainer>
            {incident.imageIds.map((img) => (
              <ImagePreview  key={img}>
                <Image src={getImageUrl(img)} width={200} height={200} alt="Kein Bild" />
              </ImagePreview>
            ))}
          </ImageContainer>
        </UiDrawer.Body>
      </UiDrawer>
    </UiCaptionList>
  )
}
export default IncidentInfo

const ImageContainer = styled.div`
  display: flex;
  align-items: start;
  gap: 0.5rem;
`
const ImagePreview = styled.div`
`
