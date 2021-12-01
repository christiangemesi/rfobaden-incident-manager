import React from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiButton from '@/components/Ui/Button/UiButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiTitle from '@/components/Ui/Title/UiTitle'

const UiIconButtonGroupExample: React.VFC = () => {
  return (
    <UiContainer>
      <UiTitle level={3}>Icon-Button-Group</UiTitle>
      <UiGrid gap={0.5}>
        <UiGrid.Col>

        </UiGrid.Col>
      </UiGrid>
      <UiTitle level={3}>Icon-Button</UiTitle>
      <UiGrid gap={0.5}>
        <UiGrid.Col>

        </UiGrid.Col>
      </UiGrid>
    </UiContainer>
  )
}
export default UiIconButtonGroupExample
