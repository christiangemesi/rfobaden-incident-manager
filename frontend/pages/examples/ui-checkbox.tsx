import React, { useState } from 'react'
import UiCheckbox from '@/components/Ui/Checkbox/UiCheckbox'

const UiCheckboxExample: React.VFC = () => {

  const [value, setValue] = useState(false)
  return (
    <div>
      <UiCheckbox label="Checkbox Label" value={value} onChange={setValue} />
      <br />
      <UiCheckbox label="Disabled Checkbox Label" isDisabled value={value} onChange={setValue} />
      <br />
      <UiCheckbox label="Error Checkbox Label" value={value} onChange={setValue} errors={['Error 1','Error 2']} />
    </div>
  )
}

export default UiCheckboxExample