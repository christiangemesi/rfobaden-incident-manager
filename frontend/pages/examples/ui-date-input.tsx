import UiDateInput from '@/components/Ui/Input/Date/UiDateInput'
import { useState } from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'

const UiDateInputExample: React.VFC = () => {
  const [value, setValue] = useState<Date | null>(null)

  return(
    <UiContainer>
      <UiDateInput value={value} onChange={setValue} label="Date Input" placeholder="dd.MM.yyyy hh:mm" />
      <UiTextInput value={value?.toLocaleString()??''} onChange={function () {return}} />
    </UiContainer>
  )
}

export default UiDateInputExample