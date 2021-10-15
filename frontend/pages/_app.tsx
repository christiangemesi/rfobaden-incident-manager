import { AppProps } from 'next/app'
import React from 'react'
import Head from 'next/head'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import { defaultTheme } from '@/theme'
import { useAsync } from 'react-use'
import BackendService from '@/services/BackendService'
import SessionStore, { useSession } from '@/stores/SessionStore'
import Model from '@/models/base/Model'
import Link from 'next/link'

import 'reset-css/reset.css'

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  useAsync(async () => {
    const [currentUser, error] = await BackendService.find<Model & { username: string }>('session')
    if (error !== null) {
      if (error.status === 404) {
        // No session present - user is not logged in.
        return
      }
      throw error
    }
    SessionStore.setCurrentUser({
      id: currentUser.id,
      name: currentUser.username,
    })
  })

  const { currentUser } = useSession()
  const logout = async () => {
    await BackendService.delete('session')
    SessionStore.clear()
  }

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
            <button type="button" onClick={logout}>
              {currentUser.name} abmelden →
            </button>
          )}
        </SessionStateBar>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
export default App

const GlobalStyle = createGlobalStyle`
  html, body, #__next {
    font-family: sans-serif;
    width: 100%;
    height: 100%;
    min-height: 100%;
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
`

const SessionStateBar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0.25rem;
`