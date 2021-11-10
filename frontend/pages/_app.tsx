import { AppProps } from 'next/app'
import React, { useMemo, useState } from 'react'
import Head from 'next/head'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import { defaultTheme } from '@/theme'
import { useAsync, useToggle } from 'react-use'
import BackendService from '@/services/BackendService'
import SessionStore, { useSession } from '@/stores/SessionStore'
import Link from 'next/link'

import 'reset-css/reset.css'
import User, { parseUser } from '@/models/User'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiButton from '@/components/Ui/Button/UiButton'

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  console.log(process.env.NODE_ENV)

  const [hasSession, setHasSession] = useState(false)
  useAsync(async () => {
    const [currentUser, error] = await BackendService.find<User>('session')
    setHasSession(true)
    if (error !== null) {
      if (error.status === 404) {
        // No session present - user is not logged in.
        return
      }
      throw error
    }
    SessionStore.setCurrentUser(parseUser(currentUser))
  })

  const { currentUser } = useSession()
  const logout = async () => {
    await BackendService.delete('session')
    SessionStore.clear()
  }

  const component = useMemo(() => {
    if (!hasSession) {
      return <React.Fragment />
    }
    return <Component {...pageProps} />
  }, [Component, pageProps, hasSession])

  return (
    <>
      <Head>
        <title key="title">RFOBaden IncidentManager</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <GlobalStyle />
      <ThemeProvider theme={defaultTheme}>
        <SessionStateBar>
          {currentUser === null ? (
            <Link href="/anmelden">
              <a>
                <button type="button">
                  → anmelden
                </button>
              </a>
            </Link>
          ) : (
            <UiGrid gap={1}>
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
        </SessionStateBar>
        {component}
      </ThemeProvider>
    </>
  )
}
export default App

const GlobalStyle = createGlobalStyle`
  html, body, #__next {
    font-family: sans-serif;
  }
  
  * {
    box-sizing: border-box;
  }

  h1 {
    font-family: serif;
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 1rem;
  }
  
  button {
    cursor: pointer;
  }

  @media print {
    @page {
      size: auto;
      margin: 0;
    }

    #__next {
      display: none;
    }
  }

  @media not print {
    html, body, #__next {
      width: 100%;
      height: 100%;
      min-height: 100%;
    }
    
    .print-only {
      display: none;
    }
  }
`

const SessionStateBar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0.25rem;
`