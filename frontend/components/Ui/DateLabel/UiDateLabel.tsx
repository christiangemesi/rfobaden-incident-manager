import React from 'react'
import UiDate, { UiDateType } from '@/components/Ui/Date/UiDate'

interface Props {
  start: Date
  end?: Date | null
  type?: UiDateType
}

const UiDateLabel: React.VFC<Props> = ({ start, end = null, type = 'date' }) => {
  const prefix = start < new Date() ? 'seit' : 'ab'
  if (end !== null) {
    return (
      <React.Fragment>
        {prefix} <UiDate value={start} type={type} /> bis <UiDate value={end} type={type} />
      </React.Fragment>
    )
  }
  return <React.Fragment>{prefix} <UiDate value={start} type={type} /></React.Fragment>
}
export default UiDateLabel