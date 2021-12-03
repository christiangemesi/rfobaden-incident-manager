import UiDateInput from '@/components/Ui/Input/Date/UiDateInput'
import { useState } from 'react'

const UiDateInputExample: React.VFC = () => {
  const [value, setValue] = useState<Date | null>(null)

  return(
    <div>
      <UiDateInput value={value} onChange={setValue} label="Date Input" placeholder="dd.mm.yyyy hh:mm" />
      {value?.toLocaleString()}
    </div>
  )
}

export default UiDateInputExample