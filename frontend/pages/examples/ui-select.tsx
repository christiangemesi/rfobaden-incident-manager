import React, { useState } from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiSelectInput from '@/components/Ui/Input/Select/UiSelectInput'

/**
 * `UiSelectInputExample` is an example page for the {@link UiSelectInput} component.
 */
const UiSelectInputExample: React.VFC = () => {
  // Default option for all selects
  const [options, setOptions] = useState<string[]>([
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
  ])

  // The currently selected values of each select.
  const [currentValue, setCurrentValue] = useState<string | null>(null)
  const [currentValue2, setCurrentValue2] = useState<string | null>(null)
  const [currentValue3, setCurrentValue3] = useState<string | null>(null)
  const [currentValue4, setCurrentValue4] = useState<string | null>(null)
  const [currentValue5] = useState<string | null>(null)
  const [currentValue6, setCurrentValue6] = useState<string | null>(null)

  return (
    <UiContainer>
      <UiGrid gap={0.5}>
        {/* Simple select input */}
        <UiGrid.Col>
          <UiSelectInput label="options" options={options} value={currentValue} onChange={(newValue) => {
            setCurrentValue(newValue)
          }} />
        </UiGrid.Col>

        {/* Disabled select input */}
        <UiGrid.Col>
          <UiSelectInput label="disabled" options={options} value={currentValue2} onChange={(newValue) => {
            setCurrentValue2(newValue)
          }} isDisabled placeholder="disable" />
        </UiGrid.Col>

        {/* Searchable select input without creation */}
        <UiGrid.Col>
          <UiSelectInput label="searchable" options={options} value={currentValue3} onChange={(newValue) => {
            setCurrentValue3(newValue)
          }} isSearchable placeholder="search" />
        </UiGrid.Col>

      </UiGrid>
      <UiGrid gap={0.5}>

        {/* Select input with failed validation */}
        <UiGrid.Col>
          <UiSelectInput label="error" options={options} value={currentValue4} onChange={(newValue) => {
            setCurrentValue4(newValue)
          }} errors={['Fail not selected']} menuPlacement="top" placeholder="error" />
        </UiGrid.Col>

        {/* Select input without options */}
        <UiGrid.Col>
          <UiSelectInput label="empty options" options={[]} value={currentValue5} onChange={() => {
            return
          }} placeholder="Empty" />
        </UiGrid.Col>

        {/* Creatable select input with search functionality */}
        <UiGrid.Col>
          <UiSelectInput isSearchable onCreate={
            (string) => {
              setCurrentValue6(string)
              setOptions([...options, string])
            }
          } label="creatable" options={options} value={currentValue6} onChange={(newValue) => {
            setCurrentValue6(newValue)
          }} menuPlacement="bottom" placeholder="creatable" />
        </UiGrid.Col>
      </UiGrid>
    </UiContainer>
  )
}
export default UiSelectInputExample