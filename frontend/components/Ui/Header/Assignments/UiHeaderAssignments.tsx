import UiHeaderItem from '@/components/Ui/Header/Item/UiHeaderItem'
import Priority from '@/models/Priority'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import React, { useEffect, useState } from 'react'
import { useSession } from '@/stores/SessionStore'
import styled, { css } from 'styled-components'
import UiLink from '@/components/Ui/Link/UiLink'
import backendService, { BackendResponse } from '@/services/BackendService'
import Assignments from '@/models/Assignments'

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
      const [assignments, assignmentsError]: BackendResponse<Assignments> = await backendService.find(
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
  }, [currentUser, assignmentCount])

  return (
    <UiHeaderItem title="Zugewiesene Aufgaben">
      <AssignmentCounter>
        <PriorityContainer href="/meine-aufgaben">
          <Icon priority={Priority.HIGH}>
            <UiIcon.PriorityHigh />
          </Icon>
          {assignmentCount.high}
        </PriorityContainer>
        <PriorityContainer href="/meine-aufgaben">
          <Icon priority={Priority.MEDIUM}>
            <UiIcon.PriorityMedium />
          </Icon>
          {assignmentCount.medium}
        </PriorityContainer>
        <PriorityContainer href="/meine-aufgaben">
          <Icon priority={Priority.LOW}>
            <UiIcon.PriorityLow />
          </Icon>
          {assignmentCount.low}
        </PriorityContainer>
      </AssignmentCounter>
    </UiHeaderItem>
  )
}

export default UiHeaderAssignments

const AssignmentCounter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const PriorityContainer = styled(UiLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;
  margin: 0 0.6rem;
`
const Icon = styled.div<{ priority: Priority }>`
  ${({ priority }) => priority == Priority.LOW && css`
    color: ${({ theme }) => theme.colors.success.value};
  `}

  ${({ priority }) => priority == Priority.MEDIUM && css`
    color: ${({ theme }) => theme.colors.warning.value};
  `}

  ${({ priority }) => priority == Priority.HIGH && css`
    color: ${({ theme }) => theme.colors.error.value};
  `}
`