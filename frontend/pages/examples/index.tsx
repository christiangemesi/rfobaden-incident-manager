import React from 'react'
import Link from 'next/link'

const UiComponentsExample: React.VFC = () => {
  return (
    <React.Fragment>
      <Link href="examples/ui-badge">
        <a>
          UiBadge
        </a>
      </Link>
      <Link href="examples/ui-textarea">
        <a>
          UiTextArea
        </a>
      </Link>
    </React.Fragment>
  )
}
export default UiComponentsExample