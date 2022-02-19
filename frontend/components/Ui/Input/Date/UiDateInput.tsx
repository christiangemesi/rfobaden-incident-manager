import React, { useState } from 'react'
import { UiInputProps } from '@/components/Ui/Input'
import { useUpdateEffect } from 'react-use'
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'


interface Props extends UiInputProps<Date | null> {
  label?: string
  placeholder?: string
}

const UiDateInput: React.VFC<Props> = ({
  label,
  placeholder = '',
  onChange: handleChange,
  errors = [],
}) => {

  const [text, setText] = useState<string | null>(null)
  const [date, setDate] = useState<Date | null>(null)
  const [isInvalid, setInvalid] = useState<boolean>(false)

  useUpdateEffect(() => {
    if (text === null) {
      handleChange(null)
      setInvalid(false)
      return
    }
    const [date, time] = text.split(' ', 2).map((n) => n.trim())
    const [hour, min] = time === undefined ? [0, 0] : time.split(':', 2).map((n) => parseInt(n.trim()))
    const [day, month, year] = date.split('.', 3).map((n) => parseInt(n.trim()))
    const newDate = new Date(Date.UTC(year, month - 1, day, hour - 1, min))

    if (isNaN(newDate.getTime())) {
      handleChange(null)
      setInvalid(true)
      return
    }
    handleChange(newDate)
    setInvalid(false)
  }, [text])

  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {/*<UiTextInput label={label} placeholder={placeholder} value={text} onChange={setText} errors={isInvalid ? ['ist invalid', ...errors] : errors}>*/}
        {/*  <UiIcon.Calendar />*/}
        {/*</UiTextInput>*/}
        <DateTimePicker
          autoOk
          ampm={false}
          disableFuture
          value={date}
          onChange={setDate}
          label={label}
          format="dd.MM.yyyy HH:mm"
        />
      </MuiPickersUtilsProvider>
    </div>
  )
}

export default UiDateInput