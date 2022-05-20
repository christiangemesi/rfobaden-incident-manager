import UiDateInput from '@/components/Ui/Input/Date/UiDateInput'
import React, { useState } from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'

/**
 * `UiDateInputExample` is an example page of a {@link UiDateInput}.
 * It shows the usage of the `UiDateInput` component.
 */
const UiDateInputExample: React.VFC = () => {
  const [value, setValue] = useState<Date | null>(null)

  return (
    <UiContainer>
      {/* Normal date input usage */}
      <UiDateInput
        value={value}
        onChange={setValue}
        label="Date Input as Popover"
        placeholder="dd.MM.yyyy hh:mm" />

      {/* Shows date time value */}
      <div>Date: {value?.toLocaleString()}</div>
      <br />
    </UiContainer>
  )
}
export default UiDateInputExample