import React from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiButton from '@/components/Ui/Button/UiButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'


/**
 * `UiButtonExample` is an example page for the {@link UiButton} component.
 */
const UiButtonExample: React.VFC = () => {
  return (
    <UiContainer>
      <UiGrid gap={0.5}>
        <UiGrid.Col size={3}>
          <UiButton isFull isDisabled color="success">
            <UiIcon.SubmitAction />
          </UiButton>
        </UiGrid.Col>
        <UiGrid.Col size={2}>
          <UiButton color="error">
            <UiIcon.CancelAction />
          </UiButton>
        </UiGrid.Col>
        <UiGrid.Col size={3}>
          <UiButton isFull color="success">
            <UiIcon.SubmitAction />
          </UiButton>
        </UiGrid.Col>
        <UiGrid.Col size={2}>
          <UiButton isFull>
            Button
          </UiButton>
        </UiGrid.Col>
      </UiGrid>
    </UiContainer>
  )
}
export default UiButtonExample
