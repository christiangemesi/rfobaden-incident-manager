import React, { useCallback } from 'react'
import styled from 'styled-components'
import SessionStore, { useSession } from '@/stores/SessionStore'
import { useRouter } from 'next/router'
import UiLink from '@/components/Ui/Link/UiLink'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import { Themed } from '@/theme'
import UserPasswordForm from '@/components/User/PasswordForm/UserPasswordForm'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UserEmailForm from '@/components/User/EmailForm/UserEmailForm'
import BackendService from '@/services/BackendService'
import PageHeaderItem from '@/components/Page/Header/Item/PageHeaderItem'
import PageHeaderAssignments from '@/components/Page/Header/Assignments/PageHeaderAssignments'

const PageHeader: React.VFC = () => {
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

  return (
    <Header>
      <NavContainer>
        <ImageContainer>
          <UiLink href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/public/RFOBaden_Logo_RGB.svg" alt="RFO Baden Logo" width="150" height="21" />
          </UiLink>
        </ImageContainer>
      </NavContainer>
      <ButtonList>
        <PageHeaderItem href="/changelog" title="Changelog">
          <UiIcon.Changelog />
        </PageHeaderItem>
        {currentUser !== null && (
          <PageHeaderAssignments />
        )}
        {currentUser === null ? (
          <PageHeaderItem href="/anmelden">
            <UiIcon.Login />
            <span>anmelden</span>
          </PageHeaderItem>
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
export default PageHeader

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

