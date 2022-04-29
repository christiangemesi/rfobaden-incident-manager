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

  const [numberPriorityHigh, setNumberPriorityHigh] = useState(0)
  const [numberPriorityMedium, setNumberPriorityMedium] = useState(0)
  const [numberPriorityLow, setNumberPriorityLow] = useState(0)

  useEffect(() => {
    (async () => {
      if (currentUser !== null) {
        const [assignments, assignmentsError]: BackendResponse<Assignments> = await backendService.find(
          'assignments',
        )
        if (assignmentsError !== null) {
          throw assignmentsError
        }

        setNumberPriorityHigh(assignments.transports.filter((e) => e.priority == Priority.HIGH).length
          + assignments.reports.filter((e) => e.priority == Priority.HIGH).length
          + assignments.tasks.filter((e) => e.priority == Priority.HIGH).length
          + assignments.subtasks.filter((e) => e.priority == Priority.HIGH).length)
        setNumberPriorityMedium(assignments.transports.filter((e) => e.priority == Priority.MEDIUM).length
          + assignments.reports.filter((e) => e.priority == Priority.MEDIUM).length
          + assignments.tasks.filter((e) => e.priority == Priority.MEDIUM).length
          + assignments.subtasks.filter((e) => e.priority == Priority.MEDIUM).length)
        setNumberPriorityLow(assignments.transports.filter((e) => e.priority == Priority.LOW).length
          + assignments.reports.filter((e) => e.priority == Priority.LOW).length
          + assignments.tasks.filter((e) => e.priority == Priority.LOW).length
          + assignments.subtasks.filter((e) => e.priority == Priority.LOW).length)
      }
    })()
  }, [currentUser, numberPriorityLow, numberPriorityHigh, numberPriorityMedium])

  return (
    <UiHeaderItem title="Zugewiesene Aufgaben">
      <AssignedListContainer>
        <PrioContainer href="/meine-aufgaben">
          <Icon priority={Priority.HIGH}>
            <UiIcon.PriorityHigh />
          </Icon>
          {numberPriorityHigh}
        </PrioContainer>
        <PrioContainer href="/meine-aufgaben">
          <Icon priority={Priority.MEDIUM}>
            <UiIcon.PriorityMedium />
          </Icon>
          {numberPriorityMedium}
        </PrioContainer>
        <PrioContainer href="/meine-aufgaben">
          <Icon priority={Priority.LOW}>
            <UiIcon.PriorityLow />
          </Icon>
          {numberPriorityLow}
        </PrioContainer>
      </AssignedListContainer>
    </UiHeaderItem>
  )
}

export default UiHeaderAssignments

const AssignedListContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const PrioContainer = styled(UiLink)`
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