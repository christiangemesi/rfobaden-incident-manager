import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import fileContent from '../CHANGELOG.md'

const ChangelogPage : React.VFC = () => {
  const [content, setContent] = useState('')

  useEffect(() => {
    fetch(fileContent).then((res) => res.text()).then((text) => setContent(text))
  })
  return (
    <ReactMarkdown children={content} />
  )
}

export default ChangelogPage