import React from 'react'
import ReactMarkdown from 'react-markdown'
import fileContent from '../CHANGELOG.md'
import UiContainer from '@/components/Ui/Container/UiContainer'

const ChangelogPage : React.VFC = () => {
  return (
    <UiContainer>
      <ReactMarkdown>
        {fileContent}
      </ReactMarkdown>
    </UiContainer>
  )
}

export default ChangelogPage