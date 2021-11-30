const UiTextInputExample: React.VFC = () => {

  const [value, setValue] = useState<string | null>('default text')

  const handleChange = (input: string | null) => {
    setValue(input)
  }

  return (
    <div>
      <UiTextInput label="Text Input" type="text" onChange={handleChange} value={value} />
      <br />
      <UiTextInput label="Password Input" type="password" value="top secret" />
    </div>
  )
}
import React, { useState } from 'react'

import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'

export default UiTextInputExample