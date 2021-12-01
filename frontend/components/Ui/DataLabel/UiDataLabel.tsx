import React from 'react'
import UiDate, { UiDateType } from '@/components/Ui/DataLabel/UiDate'

interface Props {
  firstDate: Date,
  secondDate?: Date | null
  type?: UiDateType
}

const UiDateLabel: React.VFC<Props> = ({ firstDate, secondDate = null, type = 'date' }) => {
  const prefix = firstDate < new Date() ? 'seit' : 'ab' // TODO if today seit oder ab? seit Heute oder ab Heute ????
  if (secondDate !== null) {
    return (
      <React.Fragment>
        {prefix} <UiDate date={firstDate} type={type} /> bis <UiDate date={secondDate} type={type} />
      </React.Fragment>
    )
  }
  return <React.Fragment>{prefix} <UiDate date={firstDate} type={type} /></React.Fragment>
}
export default UiDateLabel