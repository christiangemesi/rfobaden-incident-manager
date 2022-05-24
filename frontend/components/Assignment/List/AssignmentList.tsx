import UiTitle from '@/components/Ui/Title/UiTitle'
import React from 'react'
import styled from 'styled-components'
import Transport from '@/models/Transport'
import Report from '@/models/Report'
import Task from '@/models/Task'
import Subtask from '@/models/Subtask'
import AssignmentListItem from '@/components/Assignment/List/Item/AssignmentListItem'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiIcon from '@/components/Ui/Icon/UiIcon'

interface Props {
  /**
   * Title of the grouped entities.
   */
  title?: string

  /**
   * List of assigned {@link Transport transports}.
   */
  transports: Transport[]

  /**
   * List of assigned {@link Report reports}.
   */
  reports: Report[]

  /**
   * List of assigned {@link Task tasks}.
   */
  tasks: Task[]

  /**
   * List of assigned {@link Subtask subtasks}.
   */
  subtasks: Subtask[]
}

/**
 * `AssignmentList` is a component that displays a list of assigned {@link Trackable entities} using {@link AssignmentListItem}.
 */
const AssignmentList: React.VFC<Props> = ({
  title = '',
  transports,
  reports,
  tasks,
  subtasks,
}) => {
  return (
    <React.Fragment>
      {title.length > 0 &&
        (<UiTitle level={2}>{title}</UiTitle>)
      }
      <Content>
        {/* Display transports */}
        <AssignmentListItem
          title="Transporte"
          records={transports}
          href={(transport) => '/ereignisse/' + transport.incidentId + '/transporte/' + transport.id}
        />

        {/* Display reports with task progress, key report and location flag */}
        <AssignmentListItem
          title="Meldungen"
          records={reports}
          href={(report) => '/ereignisse/' + report.incidentId + '/meldungen/' + report.id}
        >
          {(report) => (
            <React.Fragment key={report.id}>
              <UiGrid direction="column" gapH={1}>
                {report.isKeyReport && (
                  <UiIcon.KeyMessage size={ICON_MULTIPLIER_SMALL} />
                )}
                {report.isLocationRelevantReport && (
                  <UiIcon.LocationRelevancy size={ICON_MULTIPLIER_SMALL} />
                )}
              </UiGrid>
              {report.closedTaskIds.length + '/' + report.taskIds.length}
            </React.Fragment>
          )}
        </AssignmentListItem>

        {/* Display tasks with subtask progress */}
        <AssignmentListItem
          title="Aufträge"
          records={tasks}
          href={(task) => '/ereignisse/' + task.incidentId + '/meldungen/' + task.reportId + '/auftraege/' + task.id}
        >
          {(task) => (
            <React.Fragment key={task.id}>
              {task.closedSubtaskIds.length + '/' + task.subtaskIds.length}
            </React.Fragment>
          )}
        </AssignmentListItem>

        {/* Display subtasks */}
        <AssignmentListItem
          title="Teilaufträge"
          records={subtasks}
          href={(subtask) => '/ereignisse/' + subtask.incidentId + '/meldungen/' + subtask.reportId + '/auftraege/' + subtask.taskId}
        />
      </Content>
    </React.Fragment>
  )
}
export default AssignmentList

const ICON_MULTIPLIER_SMALL = 0.75

const Content = styled.div`
  margin-top: 1rem;
  margin-bottom: 3rem;
`
