import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import UiButton from '@/components/Ui/Button/UiButton'
import SessionStore, { useSession } from '@/stores/SessionStore'
import { useRouter } from 'next/router'
import UiLink from '@/components/Ui/Link/UiLink'
import UiHeaderItem from '@/components/Ui/Header/Item/UiHeaderItem'
import UiIcon from '@/components/Ui/Icon/UiIcon'


const UiHeader: React.VFC = () => {

  const { currentUser } = useSession()

  const router = useRouter()

  const logout = async () => {
    SessionStore.clear()

    // Should probably not do this everytime, but only if we are on a page
    // which only signed in users can access. There's currently no nice way to detect this,
    // so we just do it for every page.
    await router.push('/')
  }

  return (
    <HeaderContainer>
      <NavContainer>
        <ImageContainer>
          <UiLink href="/">
            <Image src="/RFOBaden_Logo_RGB.svg" alt="RFO Baden Logo" width="150" height="21" />
          </UiLink>
        </ImageContainer>
        <nav>
          <NavBar>
            <UiHeaderItem href="/benutzer">
              Benutzer
            </UiHeaderItem>
            <UiHeaderItem href="/ereignisse">
              Ereignisse
            </UiHeaderItem>
          </NavBar>
        </nav>
      </NavContainer>
      <ButtonList>
        {currentUser === null ? (
          <UiLink href="/anmelden">
            <UiButton type="button">
              → anmelden
            </UiButton>
          </UiLink>
        ) : (
          <React.Fragment>
            <UiLink href="/profil">
              <UiButton type="button">
                {currentUser.firstName} {currentUser.lastName}
              </UiButton>
            </UiLink>
            <UiButton onClick={logout}>
              abmelden →
            </UiButton>
          </React.Fragment>
        )}
        <div>
          <UiLink href="/changelog">
            <UiIcon.EditAction />
          </UiLink>
        </div>
      </ButtonList>
    </HeaderContainer>
  )
}
export default UiHeader


const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 4rem;
  padding: 10px 50px 10px 50px;
  margin-bottom: 3rem;
  background: ${({ theme }) => theme.colors.secondary.value};
`
const NavContainer = styled.div`
  display: flex;
`
const ImageContainer = styled.div`
  display: flex;
  align-items: center;
`
const NavBar = styled.ul`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-left: 2rem;
  list-style: none;
`
const ButtonList = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`