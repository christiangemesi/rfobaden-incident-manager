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
      <Link href="examples/ui-date-label">
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
      <br />
      <Link href="examples/ui-list-item">
        <a>
          UiListItem
        </a>
      </Link>
      <br />
      <Link href="examples/ui-icon-button">
        <a>
          UiIconButtonGroup
        </a>
      </Link>
      <br />
      <Link href="examples/ui-select">
        <a>
          UiSelect
        </a>
      </Link>
    </React.Fragment>
  )
}
export default UiComponentsExample