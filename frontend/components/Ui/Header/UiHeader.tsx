import React, { CSSProperties } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import UiButton from '@/components/Ui/Button/UiButton'
import SessionStore, { useSession } from '@/stores/SessionStore'
import { useRouter } from 'next/router'
import UiLink from '@/components/Ui/Link/UiLink'
import { defaultTheme } from '@/theme'


const UiHeader: React.VFC = () => {

  const { currentUser } = useSession()

  const router = useRouter()
  const hrefIcident = '/ereignisse'
  const hrefUser = '/benutzer'
  const styleIncident: CSSProperties = {
    borderBottom: router.asPath === hrefIcident ? 'solid 1px ' + defaultTheme.colors.secondary.contrast : 'none',
  }
  const styleUser: CSSProperties = {
    borderBottom: router.asPath === hrefUser ? 'solid 1px '+ defaultTheme.colors.secondary.contrast : 'none',
  }

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
        <NavBar>
          <NavItem data-name="Benutzer">
            <NavLink href={hrefUser} style={styleUser}>
              Benutzer
            </NavLink>
          </NavItem>
          <NavItem data-name="Ereignisse">
            <NavLink href={hrefIcident} style={styleIncident}>
              Ereignisse
            </NavLink>
          </NavItem>
        </NavBar>
      </NavContainer>
      <ButtonList>
        {currentUser === null ? (
          <NavLink href="/anmelden">
            <UiButton type="button">
              → anmelden
            </UiButton>
          </NavLink>
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
      </ButtonList>
    </HeaderContainer>
  )
}
export default UiHeader

const NavLink = styled(UiLink)`
  color: ${({ theme }) => theme.colors.secondary.contrast};
  font-size: 1rem;
  
  :hover {
    font-weight: bold;
  }
`
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
const NavBar = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-left: 2rem;
`
const NavItem = styled.div`
  padding: 0.5rem;

  &::before {
    display: block;
    content: attr(data-name);
    font-weight: bold;
    height: 1px;
    color: transparent;
    overflow: hidden;
    visibility: hidden;
  }
`
const ButtonList = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`