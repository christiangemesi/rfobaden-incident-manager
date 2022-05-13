import NextApp, { AppProps } from 'next/app'
import React, { Fragment, useMemo } from 'react'
import Head from 'next/head'
import styled, { createGlobalStyle, css, ThemeProvider } from 'styled-components'
import { defaultTheme, Theme } from '@/theme'
import { useEffectOnce } from 'react-use'
import BackendService, { loadSessionFromRequest, ServerSideSessionHolder } from '@/services/BackendService'
import SessionStore, { useSession } from '@/stores/SessionStore'
import User from '@/models/User'
import UiScroll from '@/components/Ui/Scroll/UiScroll'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'
import { IncomingMessage } from 'http'
import UiAlertList from '@/components/Ui/Alert/List/UiAlertList'
import AlertStore, { useAlerts } from '@/stores/AlertStore'
import UiAlert from '@/components/Ui/Alert/UiAlert'

import 'reset-css/reset.css'
import { useBreakpointName } from '@/utils/hooks/useBreakpoints'

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

  const alerts = useAlerts()

  const { currentUser } = useSession()
  const component = useMemo(() => (
    // Render the component only if either there is no active session or if the sessions' user is correctly stored.
    (user === null || currentUser !== null)
      ? <Component {...pageProps} />
      : <React.Fragment />
  ), [Component, pageProps, currentUser, user])

  return (
    <Fragment>
      <Head>
        <title key="title">RFOBaden IncidentManager</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ThemeProvider theme={defaultTheme}>
        <GlobalStyle />
        <UiScroll>
          {component}
          <UiAlertList>
            {alerts.map((alert) =>
              <UiAlert key={alert.id} alert={alert} onRemove={AlertStore.remove} />
            )}
          </UiAlertList>
          {process.env.NODE_ENV === 'development' && (
            <BreakpointOverlay />
          )}
        </UiScroll>
      </ThemeProvider>
    </Fragment>
  )
}
export default App
;
(App as unknown as typeof NextApp).getInitialProps = async (appContext) => {
  let pageUser: User | null = null

  const { req } = appContext.ctx
  if (req) {
    // Load the session from the request.
    // This requires access to the requests' cookies, which exist in the req object,
    // but are not listed in its type definition, which is why this somewhat strange cast is necessary.
    const {
      user,
      backendService,
    } = await loadSessionFromRequest(req as IncomingMessage & { cookies: NextApiRequestCookies }, BackendService)
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

    // Show background-color in print output.
    // Yes, !important is required here so that it works in all browsers.
    color-adjust: exact !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }

  ${({ theme }) => css`
    body {
      width: 100%;
      height: 100%;
      font-family: ${theme.fonts.body};
      background: ${theme.colors.tertiary.value};
      color: ${theme.colors.tertiary.contrast};
    }
  `}
  button {
    cursor: pointer;
  }

  @media print {
    body {
      background-color: transparent;
    }
  }
`

const BreakpointOverlay: React.VFC = () => {
  const breakpoint = useBreakpointName()
  return <BreakpointBox>{breakpoint}</BreakpointBox>
}

const BreakpointBox = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  padding: 1rem;
  z-index: 1000;
`
