import UiHeaderItem from '@/components/Ui/Header/Item/UiHeaderItem'
import Priority from '@/models/Priority'
import React, { useEffect, useState } from 'react'
import { useCurrentUser } from '@/stores/SessionStore'
import styled from 'styled-components'
import UiLink from '@/components/Ui/Link/UiLink'
import BackendService, { BackendResponse } from '@/services/BackendService'
import AssignmentData, { groupAssigned } from '@/models/AssignmentData'
import UiPriority from '@/components/Ui/Priority/UiPriority'
import { isOpenTransport, parseTransport } from '@/models/Transport'
import { isOpenReport, parseReport } from '@/models/Report'
import { isOpenTask, parseTask } from '@/models/Task'
import { isOpenSubtask, parseSubtask } from '@/models/Subtask'
import TransportStore, { useTransports } from '@/stores/TransportStore'
import ReportStore, { useReports } from '@/stores/ReportStore'
import TaskStore, { useTasks } from '@/stores/TaskStore'
import SubtaskStore, { useSubtasks } from '@/stores/SubtaskStore'

const UiHeaderAssignments: React.VFC = () => {
  const currentUser = useCurrentUser()

  const [assignmentCount, setAssignmentCount] = useState(() => ({
    high: 0,
    medium: 0,
    low: 0,
  }))

  const transports = useTransports(groupAssigned(currentUser, isOpenTransport))
  const reports = useReports(groupAssigned(currentUser, isOpenReport))
  const tasks = useTasks(groupAssigned(currentUser, isOpenTask))
  const subtasks = useSubtasks(groupAssigned(currentUser, isOpenSubtask))

  useEffect(() => {
    setAssignmentCount({
      low: transports.LOW.length + reports.LOW.length + tasks.LOW.length + subtasks.LOW.length,
      medium: transports.MEDIUM.length + reports.MEDIUM.length + tasks.MEDIUM.length + subtasks.MEDIUM.length,
      high: transports.HIGH.length + reports.HIGH.length + tasks.HIGH.length + subtasks.HIGH.length,
    })
  }, [transports, reports, tasks, subtasks])

  useEffect(() => {
    (async () => {
      if (currentUser === null) {
        return
      }
      const [assignments, assignmentsError]: BackendResponse<AssignmentData> = await BackendService.find(
        'assignments',
      )
      if (assignmentsError !== null) {
        throw assignmentsError
      }

      TransportStore.saveAll(assignments.transports.map(parseTransport))
      ReportStore.saveAll(assignments.reports.map(parseReport))
      TaskStore.saveAll(assignments.tasks.map(parseTask))
      SubtaskStore.saveAll(assignments.subtasks.map(parseSubtask))

    })()
  }, [currentUser])

  return (
    <UiLink href="/meine-aufgaben">
      <UiHeaderItem title="Zugewiesene Aufgaben">
        <AssignmentCounter>
          <PriorityContainer>
            <PriorityIcon priority={Priority.HIGH} />
            {assignmentCount.high}
          </PriorityContainer>
          <PriorityContainer>
            <PriorityIcon priority={Priority.MEDIUM} />
            {assignmentCount.medium}
          </PriorityContainer>
          <PriorityContainer>
            <PriorityIcon priority={Priority.LOW} />
            {assignmentCount.low}
          </PriorityContainer>
        </AssignmentCounter>
      </UiHeaderItem>
    </UiLink>
  )
}

export default UiHeaderAssignments

const AssignmentCounter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const PriorityContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.2rem;
  margin: 0 0.4rem;
  color: ${({ theme }) => theme.colors.secondary.contrast};
`
const PriorityIcon = styled(UiPriority)`
  transform: scale(0.75);
`
