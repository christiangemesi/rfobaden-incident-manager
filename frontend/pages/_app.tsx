import { AppProps } from 'next/app'
import React, { useMemo } from 'react'
import Head from 'next/head'
import styled, { createGlobalStyle, css, ThemeProvider } from 'styled-components'
import { contrastDark, defaultTheme, Theme } from '@/theme'
import { useAsync } from 'react-use'
import BackendService from '@/services/BackendService'
import SessionStore, { getSessionToken, useSession } from '@/stores/SessionStore'
import Link from 'next/link'

import 'reset-css/reset.css'
import { parseUser } from '@/models/User'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiButton from '@/components/Ui/Button/UiButton'
import { SessionResponse } from '@/models/Session'
import { useRouter } from 'next/router'
import UiHeader from '@/components/Ui/Header/UiHeader'

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
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

  const component = useMemo(() => {
    return <Component {...pageProps} />
  }, [Component, pageProps])

  return (
    <>
      <Head>
        <title key="title">RFOBaden IncidentManager</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ThemeProvider theme={defaultTheme}>
        <GlobalStyle />
        <UiHeader>
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
        </UiHeader>
        {component}
      </ThemeProvider>
    </>
  )
}
export default App

const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  * {
    box-sizing: border-box;
  }
  
  ${({ theme }) => css`
    body {
      font-family: ${theme.fonts.body};
      background: ${theme.colors.tertiary.value};
      color: ${theme.colors.tertiary.contrast};
    }
  `}
  
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