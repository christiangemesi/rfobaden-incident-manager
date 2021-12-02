import React, { useState } from 'react'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import UiIcon from '@/components/Ui/Icon/UiIcon'

const UiTextInputExample: React.VFC = () => {

  const [value, setValue] = useState<string | null>()
  const handleChange = (input: string | null) => {
    setValue(input)
  }

  const handleClick = () => {
    console.log('Icon clicked')
  }

  return (
    <div>
      <UiTextInput label="Text Input" onChange={handleChange} value={value} placeholder="placeholder" />
      <br />
      <UiTextInput label="Password Input" type="password" value="top secret" />
      <br />
      <UiTextInput label="Text Input Errors" value="top secret" errors={['Not valid', 'Fail !!!']} />
      <br />
      <UiTextInput label="Text Input with children" onClick={handleClick} />
    </div>
  )
}

export default UiTextInputExample