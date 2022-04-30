import UiHeaderItem from '@/components/Ui/Header/Item/UiHeaderItem'
import Priority from '@/models/Priority'
import React, { useEffect, useState } from 'react'
import { useSession } from '@/stores/SessionStore'
import styled from 'styled-components'
import UiLink from '@/components/Ui/Link/UiLink'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Assignment from '@/models/Assignment'
import UiPriority from '@/components/Ui/Priority/UiPriority'

const UiHeaderAssignments: React.VFC = () => {
  const { currentUser } = useSession()

  const [assignmentCount, setAssignmentCount] = useState(() => ({
    high: 0,
    medium: 0,
    low: 0,
  }))

  useEffect(() => {
    (async () => {
      if (currentUser === null) {
        return
      }
      const [assignments, assignmentsError]: BackendResponse<Assignment> = await BackendService.find(
        'assignments',
      )
      if (assignmentsError !== null) {
        throw assignmentsError
      }

      const high = assignments.transports.filter((e) => e.priority == Priority.HIGH).length
        + assignments.reports.filter((e) => e.priority == Priority.HIGH).length
        + assignments.tasks.filter((e) => e.priority == Priority.HIGH).length
        + assignments.subtasks.filter((e) => e.priority == Priority.HIGH).length
      const medium = assignments.transports.filter((e) => e.priority == Priority.MEDIUM).length
        + assignments.reports.filter((e) => e.priority == Priority.MEDIUM).length
        + assignments.tasks.filter((e) => e.priority == Priority.MEDIUM).length
        + assignments.subtasks.filter((e) => e.priority == Priority.MEDIUM).length
      const low = assignments.transports.filter((e) => e.priority == Priority.LOW).length
        + assignments.reports.filter((e) => e.priority == Priority.LOW).length
        + assignments.tasks.filter((e) => e.priority == Priority.LOW).length
        + assignments.subtasks.filter((e) => e.priority == Priority.LOW).length

      setAssignmentCount({ high, medium, low })
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
