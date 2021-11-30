import React, { useState } from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiSelectInput from '@/components/Ui/Input/Select/UiSelectInput'

const UiButtonExample: React.VFC = () => {
  const options1 = [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
  ]
  const [currentValue, setCurrentValue] = useState<string | null>(null)

  return (
    <UiContainer>
      <UiGrid gap={0.5}>
        <UiGrid.Col>
          <UiSelectInput label="options" options={options1} value={currentValue} onChange={(newValue) => {
            setCurrentValue(newValue)
          }} />
        </UiGrid.Col>
      </UiGrid>
    </UiContainer>
  )
}
export default UiButtonExample