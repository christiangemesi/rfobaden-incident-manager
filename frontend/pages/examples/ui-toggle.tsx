import React, { useState } from 'react'
import UiToggle from '@/components/Ui/Toggle/UiToggle'
import UiContainer from '@/components/Ui/Container/UiContainer'

/**
 * `UiToggleExample` is an example page for the {@link UiToggle} component.
 */
const UiToggleExample: React.VFC = () => {
  // The input's current value.
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
