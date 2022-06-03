import React from 'react'
import ReactMarkdown from 'react-markdown'
import UiContainer from '@/components/Ui/Container/UiContainer'
import styled from 'styled-components'
import changelog from '../CHANGELOG.md'
import 'github-markdown-css/github-markdown-light.css'
import { GetServerSideProps } from 'next'
import { getSessionFromRequest } from '@/services/BackendService'
import Page from '@/components/Page/Page'

const ChangelogPage : React.VFC = () => {
  return (
    <Page>
      <UiContainer>
        <LogContainer className="markdown-body">
          <ReactMarkdown children={changelog} linkTarget="_blank" />
        </LogContainer>
      </UiContainer>
    </Page>
  )
}

export default ChangelogPage

const LogContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.light.value};
  
  ul {
    list-style: disc;
  }
  
  em {
    font-style: italic;
  }
`

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user } = getSessionFromRequest(req)
  if (user === null) {
    return { redirect: { statusCode: 302, destination: '/anmelden' }}
  }
  return {
    props: {},
  }
}
