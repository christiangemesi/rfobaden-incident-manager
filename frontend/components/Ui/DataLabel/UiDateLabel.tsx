import React from 'react'
import UiDate, { UiDateType } from '@/components/Ui/DataLabel/UiDate'

interface Props {
  start: Date,
  end?: Date | null
  type?: UiDateType
}

const UiDateLabel: React.VFC<Props> = ({ start, end = null, type = 'date' }) => {
  const prefix = start < new Date() ? 'seit' : 'ab' // TODO if today seit oder ab? seit Heute oder ab Heute ????
  if (end !== null) {
    return (
      <React.Fragment>
        {prefix} <UiDate date={start} type={type} /> bis <UiDate date={end} type={type} />
      </React.Fragment>
    )
  }
  return <React.Fragment>{prefix} <UiDate date={start} type={type} /></React.Fragment>
}
export default UiDateLabel