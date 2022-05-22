import React, { useState } from 'react'
import UiToggle from '@/components/Ui/Toggle/UiToggle'
import UiContainer from '@/components/Ui/Container/UiContainer'

/**
 * Example to demonstrate the use of a {@link UiToggle}.
 */
const UiToggleExample: React.VFC = () => {
  // Prepare value
  const [value, setValue] = useState(false as boolean | null)

  return (
    <UiContainer style={{ paddingTop: '4rem' }}>
      {/* Default toggle */}
      <UiToggle value={value} onChange={setValue} label="test" />

      {/* Validation failed toggle */}
      <UiToggle value={value} onChange={setValue} label="I am good at programming" errors={['Nothing to judge']} />

      {/* Validation failed toggle with multiple fails */}
      <UiToggle
        value={value}
        onChange={setValue}
        label="Apples are great"
        errors={['I am an error!', 'with multiple', ' arguments', 'in Array']}
      />
    </UiContainer>
  )
}
export default UiToggleExample