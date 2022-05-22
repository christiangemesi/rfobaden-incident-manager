import React, { useState } from 'react'
import UiCheckbox from '@/components/Ui/Checkbox/UiCheckbox'
import UiContainer from '@/components/Ui/Container/UiContainer'

/**
 * Example to demonstrate the use of a {@link UiCheckbox}.
 */
const UiCheckboxExample: React.VFC = () => {
  // Prepare value
  const [value, setValue] = useState(false)

  return (
    <UiContainer style={{ paddingTop: '4rem' }}>
      {/* Default checkbox */}
      <UiCheckbox label="Checkbox Label" value={value} onChange={setValue} />
      <br />

      {/* Disabled checkbox */}
      <UiCheckbox label="Disabled Checkbox Label" isDisabled value={value} onChange={setValue} />
      <br />

      {/* Validation failed checkbox */}
      <UiCheckbox label="Error Checkbox Label" value={value} onChange={setValue} errors={['Error 1', 'Error 2']} />
    </UiContainer>
  )
}

export default UiCheckboxExample