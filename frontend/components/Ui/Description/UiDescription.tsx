import React from 'react'
import styled from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'

interface Props {
  /**
   * The text to be displayed.
   */
  description: string | null

  /**
   * Additional, important information to display.
   */
  notes?: string | null
}

/**
 * `UiDescription` is a component that displays a text.
 */
const UiDescription: React.VFC<Props> = ({ description, notes = null }) => {
  return (
    <Article>
      {description !== null && (
        <Paragraph>
          {description}
        </Paragraph>
      )}
      {notes !== null && (
        <Paragraph>
          <UiIcon.AlertError />
          {notes}
        </Paragraph>
      )}
    </Article>
  )
}
export default UiDescription

const Article = styled.article`
`

const Paragraph = styled.p`
  white-space: pre-wrap;
  display: flex;
  align-items: center;
  word-break: break-word;

  :not(:first-child) {
    margin-top: 0.25rem;
  }

  ${UiIcon}:first-child {
    margin-right: 0.25rem;
  }
`