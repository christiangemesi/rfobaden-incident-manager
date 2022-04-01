import React, { useState } from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiSelectInput from '@/components/Ui/Input/Select/UiSelectInput'

const UiButtonExample: React.VFC = () => {
  const options = [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
  ]
  const [currentValue, setCurrentValue] = useState<string | null>(null)
  const [currentValue2, setCurrentValue2] = useState<string | null>(null)
  const [currentValue3, setCurrentValue3] = useState<string | null>(null)
  const [currentValue4, setCurrentValue4] = useState<string | null>(null)

  return (
    <UiContainer>
      <UiGrid gap={0.5}>
        <UiGrid.Col>
          <UiSelectInput label="options" options={options} value={currentValue} onChange={(newValue) => {
            setCurrentValue(newValue)
          }} />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiSelectInput label="disabled" options={options} value={currentValue2} onChange={(newValue) => {
            setCurrentValue2(newValue)
          }} isDisabled placeholder={'disable'} />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiSelectInput label="searchable" options={options} value={currentValue3} onChange={(newValue) => {
            setCurrentValue3(newValue)
          }} isSearchable placeholder={'search'} />
        </UiGrid.Col>
      </UiGrid>
      <UiGrid>
        <UiGrid.Col>
          <UiSelectInput label="error" options={options} value={currentValue4} onChange={(newValue) => {
            setCurrentValue4(newValue)
          }} errors={['Fail not selected']} menuPlacement={'top'} placeholder={'error'} />
        </UiGrid.Col>
      </UiGrid>
    </UiContainer>
  )
}
export default UiButtonExample