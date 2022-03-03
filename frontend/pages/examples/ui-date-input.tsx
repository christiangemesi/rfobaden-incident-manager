import UiDateInput from '@/components/Ui/Input/Date/UiDateInput'
import { useState } from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'

const UiDateInputExample: React.VFC = () => {
  const [value, setValue] = useState<Date | null>(null)
  const [value2, setValue2] = useState<Date | null>(null)

  return (
    <UiContainer>
      <UiDateInput
        value={value}
        onChange={setValue}
        label="Date Input as Popover"
        placeholder="dd.MM.yyyy hh:mm" />
      <div>Date: {value?.toLocaleString()}</div>
      <br />

      <UiDateInput
        value={value2}
        isModal={true}
        onChange={setValue2}
        label="Date Input as Modal"
        placeholder="dd.MM.yyyy hh:mm" />
      <div>Date: {value2?.toLocaleString()}</div>
    </UiContainer>
  )
}

export default UiDateInputExample