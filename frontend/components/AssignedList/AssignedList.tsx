import UiTitle from '@/components/Ui/Title/UiTitle'
import React, { Fragment, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import Incident from '@/models/Incident'
import Transport from '@/models/Transport'
import Report from '@/models/Report'
import Task from '@/models/Task'
import Subtask from '@/models/Subtask'
import UiLink from '@/components/Ui/Link/UiLink'
import AssignedListItem from '@/components/AssignedList/Item/AssignedListItem'
import Priority from '@/models/Priority'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import { Themed } from '@/theme'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import Id from '@/models/base/Id'
import IncidentStore from '@/stores/IncidentStore'

interface Props {
  title?: string
  data: {
    incidents: Incident[]
    transports: Transport[]
    reports: Report[]
    tasks: Task[]
    subtasks: Subtask[]
  }
}

const AssignedList: React.VFC<Props> = ({
  title = '',
  data,
}) => {

  return (
    <Fragment>
      {title.length > 0 &&
        (<UiTitle level={2}>{title}</UiTitle>)
      }
      <PrioContainer>
        <AssignedListItem title="Transporte" trackable={data.transports}>{(transport) => (
          <UiLink
            key={transport.id}
            href={'/ereignisse/' + transport.incidentId + '/transporte/' + transport.id}
          >
            <AssignedListChild
              incidentId={transport.incidentId}
              title={transport.title}
              isClosed={transport.isClosed}
              priority={transport.priority}
              startsAt={transport.startsAt ?? transport.createdAt}
              endsAt={transport.endsAt}
            />
          </UiLink>
        )}</AssignedListItem>
        <AssignedListItem title="Meldungen" trackable={data.reports}>{(report) => (
          <UiLink
            key={report.id}
            href={'/ereignisse/' + report.incidentId + '/meldungen/' + report.id}
          >
            <AssignedListChild
              incidentId={report.incidentId}
              title={report.title}
              isClosed={report.isClosed}
              priority={report.priority}
              startsAt={report.startsAt ?? report.createdAt}
              endsAt={report.endsAt}
              doneCounter={report.closedTaskIds.length + '/' + report.taskIds.length}
            >
              <UiGrid direction={'column'} gapH={1}>
                {report.isKeyReport ? (
                  <UiIcon.KeyMessage size={ICON_MULTIPLIER_SMALL} />
                ) : <React.Fragment />}
                {report.isLocationRelevantReport ? (
                  <UiIcon.LocationRelevancy size={ICON_MULTIPLIER_SMALL} />
                ) : <React.Fragment />}
              </UiGrid>
            </AssignedListChild>
          </UiLink>
        )}</AssignedListItem>
        <AssignedListItem title="Aufträge" trackable={data.tasks}>{(task) => (
          <UiLink
            key={task.id}
            href={'/ereignisse/' + task.incidentId + '/meldungen/' + task.reportId + '/auftraege/' + task.id}
          >
            <AssignedListChild
              incidentId={task.incidentId}
              title={task.title}
              isClosed={task.isClosed}
              priority={task.priority}
              startsAt={task.startsAt ?? task.createdAt}
              endsAt={task.endsAt}
              doneCounter={task.closedSubtaskIds.length + '/' + task.subtaskIds.length}
            />
          </UiLink>
        )}</AssignedListItem>
        <AssignedListItem title="Teilaufträge" trackable={data.subtasks}>{(subtask) => (
          <UiLink
            key={subtask.id}
            href={'/ereignisse/' + subtask.incidentId + '/meldungen/' + subtask.reportId + '/auftraege/' + subtask.taskId}
          >
            <AssignedListChild
              incidentId={subtask.incidentId}
              title={subtask.title}
              isClosed={subtask.isClosed}
              priority={subtask.priority}
              startsAt={subtask.startsAt ?? subtask.createdAt}
              endsAt={subtask.endsAt}
            />
          </UiLink>
        )}</AssignedListItem>
      </PrioContainer>
    </Fragment>
  )
}

export default AssignedList

const ICON_MULTIPLIER_SMALL = 0.75

interface ItemData {
  incidentId: Id<Incident>
  title: string
  priority: Priority
  isClosed: boolean

  startsAt: Date
  endsAt?: Date | null

  doneCounter?: string
  children?: ReactNode
}

const AssignedListChild: React.VFC<ItemData> = ({
  incidentId,
  title,
  priority,
  isClosed,
  startsAt,
  endsAt = null,
  doneCounter,
  children,
}) => {
  const incidentTitle = IncidentStore.find(incidentId)?.title ?? ''

  return (
    <Item
      isActive={false}
      isClosed={isClosed}
      title={title}
      priority={priority}
      user={incidentTitle}
      titleSwitched={true}
    >
      <SuffixList>
        <SuffixDate hasEnd={endsAt != null}>
          <UiDateLabel start={startsAt} end={endsAt} />
        </SuffixDate>
        {children}
        {doneCounter}
      </SuffixList>
    </Item>
  )
}

const PrioContainer = styled.div`
  margin: 2rem 0;
`

const Item = styled(UiListItemWithDetails)<{ isActive: boolean }>`
  ${({ isActive }) => isActive && css`
    transition-duration: 300ms;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  `}
}
`

const SuffixList = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 1.5rem;
  white-space: nowrap;

  transition: 150ms ease-out;
  transition-property: column-gap;
`
const SuffixDate = styled.div<{ hasEnd: boolean }>`
  ${Themed.media.sm.max} {
    display: none;
  }

  > span {
    ${Themed.media.md.max} {
      ${({ hasEnd }) => hasEnd && css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
      `}
    }
  }
`

