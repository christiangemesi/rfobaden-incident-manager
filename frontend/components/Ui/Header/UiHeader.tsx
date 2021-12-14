import React, { ReactNode } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import Link from 'next/link'
import UiButton from '@/components/Ui/Button/UiButton'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import SessionStore, { getSessionToken, useSession } from '@/stores/SessionStore'
import { useAsync } from 'react-use'
import BackendService from '@/services/BackendService'
import { SessionResponse } from '@/models/Session'
import { parseUser } from '@/models/User'
import { useRouter } from 'next/router'
import UiTitle from '@/components/Ui/Title/UiTitle'


interface Props{
   //isFluid?: boolean
  children?: ReactNode
 }

const UiHeader: React.VFC <Props> =({ children }) =>{

  useAsync(async () => {
    const token = getSessionToken()
    if (token === null) {
      SessionStore.clear()
      return
    }
    const [data, error] = await BackendService.find<SessionResponse>('session')
    if (error !== null) {
      if (error.status === 401) {
        SessionStore.clear()
        return
      }
      throw error
    }
    if (data.user === null) {
      SessionStore.clear()
      return
    }
    SessionStore.setSession(data.token, parseUser(data.user))
  })

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
        
      <ImageContainer>
        <Link href="/">
          <Image src="/RFOBaden_Logo_RGB.svg" alt="RFO Baden Logo" width="150%" height="150%" />
        </Link>
      </ImageContainer>
        
      <NavBar>
        <NavItem>
          <Link href="/">
            <a>
              <UiTitle level={7}>
              Home
              </UiTitle>
            </a>
          </Link>
        </NavItem>
        <NavItem>
          <Link href="/benutzer">
            <a>
              <UiTitle level={7}>
                Benutzer
              </UiTitle>
            </a>
          </Link>
        </NavItem>
        <NavItem>
          <Link href="/ereignisse">
            <a>
              <UiTitle level={7}>
                Ereignisse
              </UiTitle>
            </a>
          </Link>
        </NavItem>
      </NavBar>
        
      <ButtonList>
        {/*<SessionStateBar>*/}
        {currentUser === null ? (
          <Link href="/anmelden">
            <a>
              <UiButton type="button">
                  → anmelden
              </UiButton>
            </a>
          </Link>
        ) : (
          <UiGrid>
            <UiGrid.Col>
              <Link href="/profil">
                <a>
                  <UiButton type="button">
                    {currentUser.firstName} {currentUser.lastName}
                  </UiButton>
                </a>
              </Link>
            </UiGrid.Col>
            <UiGrid.Col size="auto">
              <UiButton onClick={logout}>
                  abmelden →
              </UiButton>
            </UiGrid.Col>
          </UiGrid>
        )}
        {/*</SessionStateBar>*/}
      </ButtonList>

      {/*<UiHeaderButton>*/}
      {/*  {children}*/}
      {/*</UiHeaderButton>*/}

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
const ImageContainer = styled.div`
  display: flex;
  justify-content: left;
  padding: 10px;
`
const NavBar = styled.nav`
  display: flex;
  justify-content:center; //FIXME: doesn't stay centred
  padding: 10px;
`
const NavItem = styled.div` //FIXME: navitem still has link_line 
  display: flex;
  justify-content: space-evenly;
  padding: 5px;
`
const ButtonList = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 5px;
`
// const UiHeaderButton = styled.div`
//   display: inline-flex;
//   justify-content: flex-end;
//   align-items: center;
//   //margin-right: 50px;
// `
// const SessionStateBar = styled.div`
//   display: flex;
//   justify-content: flex-end;
//   padding: 0.25rem;
//   margin-right: 50px;
//   background: rebeccapurple;
//`