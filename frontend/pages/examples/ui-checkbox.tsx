import React, { useState } from 'react'
import UiCheckbox from '@/components/Ui/Button/UiCheckbox'

const UiCheckboxExample: React.VFC = () => {

  const [checked, setChecked] = useState(false)

  const handleChange = () => {

    // TODO: value checked is before and! after toggling the same !!! WHY?
    console.log(checked ? 'checked' : 'not checked')
    setChecked(!checked)
    console.log(checked ? 'checked' : 'not checked')
  }

  return (
    <div>
      <UiCheckbox label="Checkbox Label" value="value" onChange={handleChange} checked={checked} />
      <br />
      <UiCheckbox label="Checkbox Label" value="dis" onChange={handleChange} checked={checked} isDisabled />
    </div>
  )
}

export default UiCheckboxExample