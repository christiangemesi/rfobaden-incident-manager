const UiTextInputExample: React.VFC = () => {

  const [value, setValue] = useState<string | null>()

  const handleChange = (input: string | null) => {
    setValue(input)
  }

  return (
    <div>
      <UiTextInput label="Text Input" onChange={handleChange} value={value} placeholder="placeholder" />
      <br />
      <UiTextInput label="Password Input" type="password" value="top secret" />
      <br />
      <UiTextInput label="Password Input" type="password" value="top secret" />
    </div>
  )
}
import React, { useState } from 'react'

import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'

export default UiTextInputExample