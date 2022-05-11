import Priority from '@/models/Priority'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import UiLink from '@/components/Ui/Link/UiLink'
import BackendService, { BackendResponse } from '@/services/BackendService'
import AssignmentData, { groupAssigned } from '@/models/AssignmentData'
import UiPriority from '@/components/Ui/Priority/UiPriority'
import { isOpenTransport, parseTransport } from '@/models/Transport'
import { isOpenReport, parseReport } from '@/models/Report'
import { isOpenTask, parseTask } from '@/models/Task'
import { isOpenSubtask, parseSubtask } from '@/models/Subtask'
import PageHeaderItem from '@/components/Page/Header/Item/PageHeaderItem'
import TransportStore, { useTransports } from '@/stores/TransportStore'
import ReportStore, { useReports } from '@/stores/ReportStore'
import TaskStore, { useTasks } from '@/stores/TaskStore'
import SubtaskStore, { useSubtasks } from '@/stores/SubtaskStore'
import User from '@/models/User'

interface Props {
  currentUser: User
}

const PageHeaderAssignments: React.VFC<Props> = ({
  currentUser,
}) => {
  const [assignmentCount, setAssignmentCount] = useState(() => ({
    high: 0,
    medium: 0,
    low: 0,
  }))

  const allTransports = useTransports()
  const transports = useMemo(() => (
    groupAssigned(currentUser, isOpenTransport)(allTransports)
  ), [allTransports, currentUser])

  const allReports = useReports()
  const reports = useMemo(() => (
    groupAssigned(currentUser, isOpenReport)(allReports)
  ), [allReports, currentUser])

  const allTasks = useTasks()
  const tasks = useMemo(() => (
    groupAssigned(currentUser, isOpenTask)(allTasks)
  ), [allTasks, currentUser])

  const allSubtasks = useSubtasks()
  const subtasks = useMemo(() => (
    groupAssigned(currentUser, isOpenSubtask)(allSubtasks)
  ), [allSubtasks, currentUser])

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
      <PageHeaderItem title="Zugewiesene Aufgaben">
        <AssignmentCounter>
          <PriorityContainer>
            <PriorityIcon priority={Priority.HIGH} />
            <Counter>{assignmentCount.high}</Counter>
          </PriorityContainer>
          <PriorityContainer>
            <PriorityIcon priority={Priority.MEDIUM} />
            <Counter>{assignmentCount.medium}</Counter>
          </PriorityContainer>
          <PriorityContainer>
            <PriorityIcon priority={Priority.LOW} />
            <Counter>{assignmentCount.low}</Counter>
          </PriorityContainer>
        </AssignmentCounter>
      </PageHeaderItem>
    </UiLink>
  )
}

export default PageHeaderAssignments

const AssignmentCounter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const PriorityContainer = styled.div`
  position: relative;
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
const Counter = styled.span`
  position: absolute;
  background-color: ${({ theme }) => theme.colors.grey.value};
  border-radius: 50%;
  top: -0.3rem;
  right: -0.3rem;
  padding: 0.25rem 0.4rem;
  font-size: 0.75em;
`
