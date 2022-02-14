import React from 'react'
import ReactMarkdown from 'react-markdown'
import fileContent from '../CHANGELOG.md'
import UiContainer from '@/components/Ui/Container/UiContainer'

import 'github-markdown-css/github-markdown-light.css'

const ChangelogPage : React.VFC = () => {
  return (
    <article className="markdown-body">
      <UiContainer>
        <ReactMarkdown children={fileContent} />
      </UiContainer>
    </article>
  )
}

export default ChangelogPage