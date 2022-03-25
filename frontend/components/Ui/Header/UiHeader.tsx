import React, { useCallback } from 'react'
import styled from 'styled-components'
import SessionStore, { useSession } from '@/stores/SessionStore'
import { useRouter } from 'next/router'
import UiLink from '@/components/Ui/Link/UiLink'
import UiHeaderItem from '@/components/Ui/Header/Item/UiHeaderItem'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import { Themed } from '@/theme'
import BackendService from '@/services/BackendService'


const UiHeader: React.VFC = () => {
  const { currentUser } = useSession()

  const router = useRouter()

  const logout = useCallback(async () => {
    const error = await BackendService.delete('session')
    if (error !== null) {
      throw error
    }
    await router.push('/anmelden')
    SessionStore.clear()
  }, [router])

  return (
    <Header>
      <NavContainer>
        <ImageContainer>
          <UiLink href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/RFOBaden_Logo_RGB.svg" alt="RFO Baden Logo" width="150" height="21" />
          </UiLink>
        </ImageContainer>
        <nav>
          <NavBar>
            <UiHeaderItem href="/ereignisse">
              Ereignisse
            </UiHeaderItem>
            <UiHeaderItem href="/benutzer">
              Benutzer
            </UiHeaderItem>
          </NavBar>
        </nav>
      </NavContainer>
      <ButtonList>
        <UiHeaderItem href="/changelog" title="Changelog">
          <UiIcon.Changelog />
        </UiHeaderItem>
        {currentUser === null ? (
          <UiHeaderItem href="/anmelden">
            <UiIcon.Login />
            <span>anmelden</span>
          </UiHeaderItem>
        ) : (
          <ButtonList isNarrow>
            <UiHeaderItem href="/profil" title="Profil">
              <UiIcon.UserInCircle />
            </UiHeaderItem>
            <UiHeaderItem onClick={logout}>
              <span>{currentUser.firstName} {currentUser.lastName}</span>
              <UiIcon.Logout />
            </UiHeaderItem>
          </ButtonList>
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
const NavBar = styled.ul`
  display: flex;
  gap: 2rem;
  align-items: center;
  margin-left: 2rem;
  list-style: none;
`
const ButtonList = styled.div<{ isNarrow?: boolean }>`
  display: flex;
  gap: ${({ isNarrow }) => isNarrow ? '0.75rem' : '2rem'};
  align-items: center;
`