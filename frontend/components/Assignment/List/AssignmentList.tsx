import UiTitle from '@/components/Ui/Title/UiTitle'
import React, { Fragment } from 'react'
import styled from 'styled-components'
import Transport from '@/models/Transport'
import Report from '@/models/Report'
import Task from '@/models/Task'
import Subtask from '@/models/Subtask'
import AssignmentListItem from '@/components/Assignment/List/Item/AssignmentListItem'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiIcon from '@/components/Ui/Icon/UiIcon'

interface Props {
  title?: string
  transports: Transport[]
  reports: Report[]
  tasks: Task[]
  subtasks: Subtask[]
}

const AssignmentList: React.VFC<Props> = ({
  title = '',
  transports,
  reports,
  tasks,
  subtasks,
}) => {
  return (
    <Fragment>
      {title.length > 0 &&
        (<UiTitle level={2}>{title}</UiTitle>)
      }
      <Content>
        <AssignmentListItem
          title="Transporte"
          records={transports}
          href={(transport) => '/ereignisse/' + transport.incidentId + '/transporte/' + transport.id}
        />
        <AssignmentListItem
          title="Meldungen"
          records={reports}
          href={(report) => '/ereignisse/' + report.incidentId + '/meldungen/' + report.id}
          isDone={(report) => report.isDone}
        >
          {(report) => (
            <Fragment key={report.id}>
              <UiGrid direction="column" gapH={1}>
                {report.isKeyReport && (
                  <UiIcon.KeyMessage size={ICON_MULTIPLIER_SMALL} />
                )}
                {report.isLocationRelevantReport && (
                  <UiIcon.LocationRelevancy size={ICON_MULTIPLIER_SMALL} />
                )}
              </UiGrid>
              {report.closedTaskIds.length + '/' + report.taskIds.length}
            </Fragment>
          )}
        </AssignmentListItem>
        <AssignmentListItem
          title="Aufträge"
          records={tasks}
          href={(task) => '/ereignisse/' + task.incidentId + '/meldungen/' + task.reportId + '/auftraege/' + task.id}
          isDone={(task) => task.isDone}
        >
          {(task) => (
            <Fragment key={task.id}>
              {task.closedSubtaskIds.length + '/' + task.subtaskIds.length}
            </Fragment>
          )}
        </AssignmentListItem>
        <AssignmentListItem
          title="Teilaufträge"
          records={subtasks}
          href={(subtask) => '/ereignisse/' + subtask.incidentId + '/meldungen/' + subtask.reportId + '/auftraege/' + subtask.taskId}
        />
      </Content>
    </Fragment>
  )
}

export default AssignmentList

const ICON_MULTIPLIER_SMALL = 0.75

const Content = styled.div`
  margin-top: 1rem;
  margin-bottom: 3rem;
`
