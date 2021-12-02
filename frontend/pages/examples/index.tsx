import React from 'react'
import Link from 'next/link'

const UiComponentsExample: React.VFC = () => {
  return (
    <React.Fragment>
      <Link href="examples/ui-grid">
        <a>
          UiGrid
        </a>
      </Link>
      <br />
      <Link href="examples/ui-badge">
        <a>
          UiBadge
        </a>
      </Link>
      <br />
      <Link href="examples/ui-text-area">
        <a>
          UiTextArea
        </a>
      </Link>
      <br />
      <Link href="examples/ui-button">
        <a>
          UiButton
        </a>
      </Link>
    </React.Fragment>
  )
}
export default UiComponentsExample