import NextApp, { AppProps } from 'next/app'
import React, { useMemo } from 'react'
import Head from 'next/head'
import styled, { createGlobalStyle, css, ThemeProvider } from 'styled-components'
import { defaultTheme, Theme } from '@/theme'
import { useEffectOnce } from 'react-use'
import BackendService, { loadSessionFromRequest, ServerSideSessionHolder } from '@/services/BackendService'
import SessionStore, { useSession } from '@/stores/SessionStore'

import 'reset-css/reset.css'
import User from '@/models/User'
import UiHeader from '@/components/Ui/Header/UiHeader'
import UiFooter from '@/components/Ui/Footer/UiFooter'
import UiScroll from '@/components/Ui/Scroll/UiScroll'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'
import { IncomingMessage } from 'http'

interface Props extends AppProps {
  user: User | null
}

const App: React.FC<Props> = ({ Component, pageProps, user }) => {
  useEffectOnce(() => {
    if (user === null) {
      SessionStore.clear()
    } else {
      SessionStore.setCurrentUser(user)
    }
  })

  const { currentUser } = useSession()
  const component = useMemo(() => (
    // Render the component only if either there is no active session or if the sessions' user is correctly stored.
    (user === null || currentUser !== null)
      ? <Component {...pageProps} />
      : <React.Fragment />
  ), [Component, pageProps, currentUser, user])

  return (
    <>
      <Head>
        <title key="title">RFOBaden IncidentManager</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ThemeProvider theme={defaultTheme}>
        <GlobalStyle />
        <UiScroll>
          <UiHeader />
          <Main>
            {component}
          </Main>
          <UiFooter />
        </UiScroll>
      </ThemeProvider>
    </>
  )
}
export default App

;(App as unknown as typeof NextApp).getInitialProps = async (appContext) => {
  let pageUser: User | null = null

  const { req } = appContext.ctx
  if (req) {
    // Load the session from the request.
    // This requires access to the requests' cookies, which exist in the req object,
    // but are not listed in its type definition, which is why this somewhat strange cast is necessary.
    const { user, backendService } = await loadSessionFromRequest(req as IncomingMessage & { cookies: NextApiRequestCookies }, BackendService)
    ;(req as unknown as ServerSideSessionHolder).session = {
      user,
      backendService,
    }
    pageUser = user
  }

  const appProps = await NextApp.getInitialProps(appContext)
  return {
    ...appProps,
    user: pageUser,
  }
}

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

const Main = styled.main`
  padding-bottom: 1rem;
  min-height: calc(100vh - 4rem - 1rem - 4rem);
`
