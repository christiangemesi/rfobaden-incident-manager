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
import UiTitle from '@/components/Ui/Title/UiTitle'
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

  // todo not working reload, correct nr on click
  useEffect(() => {
    (async () => {
      if (currentUser !== null) {
        const [transports, transportsError]: BackendResponse<Report[]> = await backendService.list(
          `users/${currentUser?.id}/assignments/transports`,
        )
        if (transportsError !== null) {
          throw transportsError
        }

        const [reports, reportsError]: BackendResponse<Report[]> = await backendService.list(
          `users/${currentUser.id}/assignments/reports`,
        )
        if (reportsError !== null) {
          throw reportsError
        }

        const [tasks, tasksError]: BackendResponse<Task[]> = await backendService.list(
          `users/${currentUser.id}/assignments/tasks`,
        )
        if (tasksError !== null) {
          throw tasksError
        }

        const [subtasks, subtasksError]: BackendResponse<Subtask[]> = await backendService.list(
          `users/${currentUser.id}/assignments/subtasks`,
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
            <UiDropDown>
              <UiDropDown.Trigger>{({ toggle }) => (
                <IconButton onClick={toggle}>
                  <AssignedListContainer
                    numberAssignments={numberPriorityHigh + numberPriorityMedium + numberPriorityLow}>
                    <UiIcon.AssignedList />
                  </AssignedListContainer>
                </IconButton>
              )}</UiDropDown.Trigger>
              <UiDropDown.Menu>
                <UiDropDown.Item>
                  <DropdownItemContainer href="/meine-aufgaben">
                    <Icon priority={Priority.HIGH}>
                      <UiIcon.PriorityHigh />
                    </Icon>
                    {numberPriorityHigh}
                  </DropdownItemContainer>
                </UiDropDown.Item>
                <UiDropDown.Item>
                  <DropdownItemContainer href="/meine-aufgaben#mittlere-prio">
                    <Icon priority={Priority.MEDIUM}>
                      <UiIcon.PriorityMedium />
                    </Icon>
                    {numberPriorityMedium}
                  </DropdownItemContainer>
                </UiDropDown.Item>
                <UiDropDown.Item>
                  <DropdownItemContainer href="/meine-aufgaben#tiefe-prio">
                    <Icon priority={Priority.LOW}>
                      <UiIcon.PriorityLow />
                    </Icon>
                    {numberPriorityLow}
                  </DropdownItemContainer>
                </UiDropDown.Item>
              </UiDropDown.Menu>
            </UiDropDown>
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
                <UiModal isFull>
                  <UiModal.Activator>{({ open }) => (
                    <UiDropDown.Item onClick={open}>Passwort bearbeiten</UiDropDown.Item>
                  )}</UiModal.Activator>
                  <UiModal.Body>{({ close }) => (
                    <React.Fragment>
                      <UiTitle level={1} isCentered>
                        Passwort bearbeiten
                      </UiTitle>
                      <UserPasswordForm user={currentUser} onClose={close} />
                    </React.Fragment>
                  )}</UiModal.Body>
                </UiModal>
                <UiModal isFull>
                  <UiModal.Activator>{({ open }) => (
                    <UiDropDown.Item onClick={open}>E-Mail bearbeiten</UiDropDown.Item>
                  )}</UiModal.Activator>
                  <UiModal.Body>{({ close }) => (
                    <React.Fragment>
                      <UiTitle level={1} isCentered>
                        E-Mail Adresse ändern
                      </UiTitle>
                      <UserEmailForm user={currentUser} onClose={close} />
                    </React.Fragment>
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
const DropdownItemContainer = styled(UiLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
`
const AssignedListContainer = styled.div<{ numberAssignments: number }>`
  ::after {
    content: '${({ numberAssignments }) => numberAssignments}';
    position: absolute;
    top: -0.4rem;
    right: -0.4rem;
    width: 1.1rem;
    height: 1.1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-size: 0.5rem;
    ${({ theme, numberAssignments }) => numberAssignments === 0 ? css`
      background: ${theme.colors.tertiary.contrast};
      color: ${theme.colors.tertiary.value};
    ` : css`
      background: ${theme.colors.error.value};
      color: ${theme.colors.error.contrast};
    `};
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
