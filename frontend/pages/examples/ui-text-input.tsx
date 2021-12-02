import React, { useState } from 'react'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import UiIcon from '@/components/Ui/Icon/UiIcon'

const UiTextInputExample: React.VFC = () => {

  const [value1, setValue1] = useState<string | null>(null)
  const [value2, setValue2] = useState<string | null>('top secret')
  const [value3, setValue3] = useState<string | null>('some things never change')
  const [value4, setValue4] = useState<string | null>(null)

  return (
    <div>
      <UiTextInput label="Text Input" placeholder="placeholder" value={value1} onChange={setValue1} />
      <br />
      <UiTextInput label="Password Input" type="password" value={value2} onChange={setValue2} />
      <br />
      <UiTextInput label="Text Input Errors" value={value3} onChange={setValue3} errors={['Not valid', 'Fail !!!']} />
      <br />
      <UiTextInput label="Text Input with children" value={value4} onChange={setValue4} onClick={() => alert('clicked!')}>
        <UiIcon.CancelAction />
      </UiTextInput>
    </div>
  )
}

export default UiTextInputExample