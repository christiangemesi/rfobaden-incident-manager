import React from 'react'
import ReactMarkdown from 'react-markdown'
import UiContainer from '@/components/Ui/Container/UiContainer'
import styled from 'styled-components'

import changelog from '../CHANGELOG.md'
import 'github-markdown-css/github-markdown-light.css'

const ChangelogPage : React.VFC = () => {
  return (
    <UiContainer>
      <LogContainer className="markdown-body">
        <ReactMarkdown children={changelog} components={{
          ul: ({ ...children }) => <ul style={{ listStyle: 'disc' }} {...children} /> }} />
      </LogContainer>
    </UiContainer>
  )
}

export default ChangelogPage

const LogContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.tertiary.value};
`