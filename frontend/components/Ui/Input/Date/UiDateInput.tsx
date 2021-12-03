import React, { useState } from 'react'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import { parseDate } from '@/models/Date'


const UiDateInput: React.VFC = () => {

  const [value, setValue] = useState<string | null>(null)
  console.log('Date: ')
  console.log(parseDate([2002, 2, 2, 14, 14, 14, 14]))


  const stringToDate = (input: string) => {
    const dateItems = input.split('.')
    return parseDate([parseInt(dateItems[2]), parseInt(dateItems[1]), parseInt(dateItems[0]), 0, 0, 0, 0])

  }


  return(
    <div>
      <UiTextInput value={value} onChange={setValue} placeholder="dd.mm.yyyy" />
      <label>{value}</label>
      <span>
      </span>
    </div>

  )
}

export default UiDateInput