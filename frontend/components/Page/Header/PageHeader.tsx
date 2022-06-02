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
import Image from 'next/image'
import rfoBadenLogo from '@/public/rfobaden-logo-text.png'
import PageHeaderAssignments from '@/components/Page/Header/Assignments/PageHeaderAssignments'
import PageHeaderItem from '@/components/Page/Header/Item/PageHeaderItem'

/**
 * `PageHeader` represents the header on the top of each page.
 */
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
            <Image src={rfoBadenLogo} alt="RFO Baden" width="150" height="21" />
          </UiLink>
        </ImageContainer>
      </NavContainer>

      <ButtonList>
        {currentUser !== null && (
          <PageHeaderAssignments currentUser={currentUser} />
        )}

        <PageHeaderItem href="/changelog" title="Changelog">
          <UiIcon.Changelog />
        </PageHeaderItem>

        {currentUser !== null && (
          <LoggedInUser>
            <UiDropDown>
              <UiDropDown.Trigger>{({ toggle }) => (
                <IconButton onClick={toggle}>
                  <Username>
                    {currentUser.firstName} {currentUser.lastName}
                  </Username>
                  <UiIcon.UserInCircle />
                </IconButton>
              )}</UiDropDown.Trigger>

              {/* Account action menu */}
              <UiDropDown.Menu>
                <DropDownUsername>
                  {currentUser.firstName} {currentUser.lastName}
                </DropDownUsername>

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
  padding: 0.75rem 3rem;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.secondary.contrast};
  background: ${({ theme }) => theme.colors.tertiary.value};

  ${Themed.media.xs.only} {
    z-index: 2;
    padding: 0.75rem 1rem;
    position: fixed;
    top: 0;
  }
`

const NavContainer = styled.div`
  display: flex;
`

const ImageContainer = styled.div`
  display: flex;
  align-items: center;

  transition: 150ms ease;
  transition-property: transform;

  :hover {
    transform: scale(1.05);
  }
`

const ButtonList = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  ${Themed.media.xs.only} {
    gap: 0.75rem;
  }
`
const LoggedInUser = styled.div`
  display: flex;
  align-items: center;
`

const Username = styled.span`
  font-size: 1em;
  margin-right: 0.25rem;

  ${Themed.media.xs.only} {
    display: none;
  }
`

const IconButton = styled(UiIconButton)`
  :hover {
    background-color: transparent;
    transform: scale(1.05);
  }
`

const DropDownUsername = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey.value};
  padding: 0.5rem 1rem;
  font-weight: bold;
  font-family: ${({ theme }) => theme.fonts.heading};
  text-align: center;

  ${Themed.media.sm.min} {
    display: none;
  }
`
