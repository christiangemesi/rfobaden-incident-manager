import { AppProps } from 'next/app'
import React, { useMemo } from 'react'
import Head from 'next/head'
import styled, { createGlobalStyle, css, ThemeProvider } from 'styled-components'
import { defaultTheme, Theme } from '@/theme'
import { createGlobalState, useAsync } from 'react-use'
import BackendService from '@/services/BackendService'
import SessionStore, { getSessionToken } from '@/stores/SessionStore'

import 'reset-css/reset.css'
import { parseUser } from '@/models/User'
import { SessionResponse } from '@/models/Session'
import UiHeader from '@/components/Ui/Header/UiHeader'
import UiFooter from '@/components/Ui/Footer/UiFooter'

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

  const component = useMemo(() => {
    return <Component {...pageProps} />
  }, [Component, pageProps])

  const [state, _] = useAppState()

  return (
    <>
      <Head>
        <title key="title">RFOBaden IncidentManager</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ThemeProvider theme={defaultTheme}>
        <GlobalStyle />
        <UiHeader />
        <Main hasFooter={state.hasFooter}>
          {component}
        </Main>
        {state.hasFooter && (
          <UiFooter />
        )}
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

const Main = styled.div<{ hasFooter: boolean }>`
  ${({ hasFooter }) => hasFooter && css`
    padding-bottom: 3rem;
    min-height: calc(100vh - 4rem - 3rem - 4rem);
  `}
`

export const useAppState = createGlobalState({
  hasFooter: true,
})