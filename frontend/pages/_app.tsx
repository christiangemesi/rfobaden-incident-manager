import { AppProps } from 'next/app'
import React, { useMemo } from 'react'
import Head from 'next/head'
import { createGlobalStyle, css, ThemeProvider } from 'styled-components'
import { defaultTheme, Theme } from '@/theme'
import { useAsync } from 'react-use'
import BackendService from '@/services/BackendService'
import SessionStore, { getSessionToken } from '@/stores/SessionStore'

import 'reset-css/reset.css'
import { parseUser } from '@/models/User'
import { SessionResponse } from '@/models/Session'
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
        <UiHeader />
        <main>
          {component}
        </main>
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
  
  main {
    padding-bottom: 3rem;
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