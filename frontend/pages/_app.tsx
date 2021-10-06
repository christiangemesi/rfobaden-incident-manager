import { AppProps } from 'next/app'
import React from 'react'
import Head from 'next/head'
import { createGlobalStyle } from 'styled-components'

import 'reset-css/reset.css'

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title key="title">RFOBaden IncidentManager</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  )
}
export default App

const GlobalStyle = createGlobalStyle`
  html, body, #__next {
    width: 100%;
    height: 100%;
    min-height: 100%;
  }
`
