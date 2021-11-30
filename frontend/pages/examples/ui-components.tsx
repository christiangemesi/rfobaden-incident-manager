import React from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiBadge from '@/components/Ui/Badge/UiBadge'
import styled from 'styled-components'

const UiComponentsExample: React.VFC = () => {
  return (
    <React.Fragment>
      <h2>UiBadge</h2>
      <UiBadge value={8}>
        <UiIcon.KeyMessage />
      </UiBadge>
      <UiBadge value={88}>
        <UiIcon.Organization />
      </UiBadge>
      <UiBadge value={888}>
        <UiIcon.KeyMessage />
      </UiBadge>
    </React.Fragment>
  )
}
export default UiComponentsExample
