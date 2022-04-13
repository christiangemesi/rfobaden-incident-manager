import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import UiTitle from '@/components/Ui/Title/UiTitle'

const UiComponentsExample: React.VFC = () => {
  return (
    <Spacer>
      <UiTitle level={3}>Examples</UiTitle>
      <UiTitle level={4}>Layouts</UiTitle>
      <Link href="examples/ui-grid">
        <a>
          UiGrid
        </a>
      </Link>
      <br />
      <UiTitle level={4}>Inputs</UiTitle>
      <Link href="examples/ui-checkbox">
        <a>
          UiCheckbox
        </a>
      </Link>
      <br />
      <Link href="examples/ui-date-input">
        <a>
          UiDateInput
        </a>
      </Link>
      <br />
      <Link href="examples/ui-priority-slider">
        <a>
          UiPrioritySlider
        </a>
      </Link>
      <br />
      <Link href="examples/ui-select">
        <a>
          UiSelect
        </a>
      </Link>
      <br />
      <Link href="examples/ui-text-area">
        <a>
          UiTextArea
        </a>
      </Link>
      <br />
      <Link href="examples/ui-text-input">
        <a>
          UiTextInput
        </a>
      </Link>
      <br />
      <Link href="examples/ui-toggle">
        <a>
          UiToggle
        </a>
      </Link>
      <br />
      <UiTitle level={4}>Buttons</UiTitle>
      <Link href="examples/ui-action-button">
        <a>
          UiActionButton
        </a>
      </Link>
      <br />
      <Link href="examples/ui-button">
        <a>
          UiButton
        </a>
      </Link>
      <br />
      <Link href="examples/ui-icon-button">
        <a>
          UiIconButtonGroup
        </a>
      </Link>
      <br />
      <UiTitle level={4}>Display Components</UiTitle>
      <Link href="examples/ui-badge">
        <a>
          UiBadge
        </a>
      </Link>
      <br />
      <Link href="examples/ui-breadcrumb">
        <a>
          UiBreadcrumb
        </a>
      </Link>
      <br />
      <Link href="examples/ui-date-label">
        <a>
          UiDateLabel
        </a>
      </Link>
      <br />
      <Link href="examples/ui-header">
        <a>
          UiHeader
        </a>
      </Link>
      <br />
      <Link href="examples/ui-list-item">
        <a>
          UiListItem
        </a>
      </Link>
      <br />
      <Link href="examples/ui-text-with-icon">
        <a>
          UiTextWithIcon
        </a>
      </Link>
      <br />
      <Link href="examples/ui-title">
        <a>
          UiTitle
        </a>
      </Link>
      <br />
      <UiTitle level={4}>Overlays</UiTitle>
      <Link href="examples/ui-modal">
        <a>
          UiModal
        </a>
      </Link>
      <br />
      <Link href="examples/ui-drawer">
        <a>
          UiDrawer
        </a>
      </Link>
      <br />
      <UiTitle level={4}>Responsive Design</UiTitle>
      <Link href="examples/custom-grid">
        <a>
          Custom Grid
        </a>
      </Link>
      <br />
    </Spacer>
  )
}
export default UiComponentsExample


const Spacer = styled.div`
  margin: 2rem;
  > h1, > h2, > h3, > h4 {
    margin: 2rem 0 1rem;
  }
  > a {
    margin: .2rem;
    display: inline-block;
  }
`
