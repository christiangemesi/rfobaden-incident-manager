import React, { useCallback, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import SessionStore, { useSession } from '@/stores/SessionStore'
import { useRouter } from 'next/router'
import UiLink from '@/components/Ui/Link/UiLink'
import UiHeaderItem from '@/components/Ui/Header/Item/UiHeaderItem'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import { Themed } from '@/theme'
import UserPasswordForm from '@/components/User/PasswordForm/UserPasswordForm'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UserEmailForm from '@/components/User/EmailForm/UserEmailForm'
import BackendService from '@/services/BackendService'
import backendService, { BackendResponse } from '@/services/BackendService'
import Priority from '@/models/Priority'
import Report from '@/models/Report'
import Task from '@/models/Task'
import Subtask from '@/models/Subtask'

const UiHeader: React.VFC = () => {
  const { currentUser } = useSession()

  const router = useRouter()

  const logout = useCallback(async () => {
    const error = await BackendService.delete('session')
    if (error !== null) {
      throw error
    }
    SessionStore.clear({ silent: true })
    await router.push('/anmelden')
  }, [router])

  const [numberPriorityHigh, setNumberPriorityHigh] = useState(0)
  const [numberPriorityMedium, setNumberPriorityMedium] = useState(0)
  const [numberPriorityLow, setNumberPriorityLow] = useState(0)

  useEffect(() => {
    (async () => {
      if (currentUser !== null) {
        const [transports, transportsError]: BackendResponse<Report[]> = await backendService.list(
          `assignments/transports/${currentUser?.id}`,
        )
        if (transportsError !== null) {
          throw transportsError
        }

        const [reports, reportsError]: BackendResponse<Report[]> = await backendService.list(
          `assignments/reports/${currentUser.id}`,
        )
        if (reportsError !== null) {
          throw reportsError
        }

        const [tasks, tasksError]: BackendResponse<Task[]> = await backendService.list(
          `assignments/tasks/${currentUser.id}`,
        )
        if (tasksError !== null) {
          throw tasksError
        }

        const [subtasks, subtasksError]: BackendResponse<Subtask[]> = await backendService.list(
          `assignments/subtasks/${currentUser.id}`,
        )
        if (subtasksError !== null) {
          throw subtasksError
        }

        setNumberPriorityHigh(reports.filter((e) => e.priority == Priority.HIGH).length
          + tasks.filter((e) => e.priority == Priority.HIGH).length
          + subtasks.filter((e) => e.priority == Priority.HIGH).length
          + transports.filter((e) => e.priority == Priority.HIGH).length)
        setNumberPriorityMedium(reports.filter((e) => e.priority == Priority.MEDIUM).length
          + tasks.filter((e) => e.priority == Priority.MEDIUM).length
          + subtasks.filter((e) => e.priority == Priority.MEDIUM).length
          + transports.filter((e) => e.priority == Priority.MEDIUM).length)
        setNumberPriorityLow(reports.filter((e) => e.priority == Priority.LOW).length
          + tasks.filter((e) => e.priority == Priority.LOW).length
          + subtasks.filter((e) => e.priority == Priority.LOW).length
          + transports.filter((e) => e.priority == Priority.LOW).length)
      }
    })()
  }, [currentUser, numberPriorityLow, numberPriorityHigh, numberPriorityMedium])

  return (
    <Header>
      <NavContainer>
        <ImageContainer>
          <UiLink href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/RFOBaden_Logo_RGB.svg" alt="RFO Baden Logo" width="150" height="21" />
          </UiLink>
        </ImageContainer>
      </NavContainer>
      <ButtonList>
        <UiHeaderItem href="/changelog" title="Changelog">
          <UiIcon.Changelog />
        </UiHeaderItem>
        {currentUser !== null && (
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
        )}
        {currentUser === null ? (
          <UiHeaderItem href="/anmelden">
            <UiIcon.Login />
            <span>anmelden</span>
          </UiHeaderItem>
        ) : (
          <LoggedInUser>
            {currentUser.firstName} {currentUser.lastName}
            <UiDropDown>
              <UiDropDown.Trigger>{({ toggle }) => (
                <IconButton onClick={toggle}>
                  <UiIcon.UserInCircle />
                </IconButton>
              )}</UiDropDown.Trigger>
              <UiDropDown.Menu>
                <UiModal title="Passwort bearbeiten">
                  <UiModal.Trigger>{({ open }) => (
                    <UiDropDown.Item onClick={open}>Passwort bearbeiten</UiDropDown.Item>
                  )}</UiModal.Trigger>
                  <UiModal.Body>{({ close }) => (
                    <UserPasswordForm user={currentUser} onClose={close} />
                  )}</UiModal.Body>
                </UiModal>
                <UiModal title="E-Mail ändern">
                  <UiModal.Trigger>{({ open }) => (
                    <UiDropDown.Item onClick={open}>E-Mail bearbeiten</UiDropDown.Item>
                  )}</UiModal.Trigger>
                  <UiModal.Body>{({ close }) => (
                    <UserEmailForm user={currentUser} onClose={close} />
                  )}</UiModal.Body>
                </UiModal>
                <UiDropDown.Item onClick={logout}>Abmelden</UiDropDown.Item>
              </UiDropDown.Menu>
            </UiDropDown>
          </LoggedInUser>
        )}
      </ButtonList>
    </Header>
  )
}
export default UiHeader

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 4rem;
  padding: 10px 50px 10px 50px;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.secondary.contrast};
  background: ${({ theme }) => theme.colors.secondary.value};

  // TODO implement mobile view
  ${Themed.media.xs.only} {
    display: none;
  }
`
const NavContainer = styled.div`
  display: flex;
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
const ImageContainer = styled.div`
  display: flex;
  align-items: center;

  img {
    transition: 150ms ease;
    transition-property: transform;

    :hover {
      transform: scale(1.05);
    }
  }
`
const ButtonList = styled.div<{ isNarrow?: boolean }>`
  display: flex;
  gap: ${({ isNarrow }) => isNarrow ? '0.75rem' : '2rem'};
  align-items: center;
`
const LoggedInUser = styled.div`
  display: flex;
  align-items: center
`
const IconButton = styled(UiIconButton)`
  :hover {
    background-color: transparent;
    transform: scale(1.05);
  }
`
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

