import React from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiSelectInput from '@/components/Ui/Input/Select/UiSelectInput'
import UiIcon from '@/components/Ui/Icon/UiIcon'

const UiButtonExample: React.VFC = () => {
  const options1 = [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
  ]
  const options2 = [
    '<UiIcon.PriorityHigh />',
    '<UiIcon.PriorityMedium />',
    '<UiIcon.PriorityLow />',
  ]
  return (
    <UiContainer>
      <UiGrid gap={0.5}>
        <UiGrid.Col>
          <UiSelectInput options={options1} />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiSelectInput options={options2} />
        </UiGrid.Col>
      </UiGrid>
    </UiContainer>
  )
}
export default UiButtonExample
