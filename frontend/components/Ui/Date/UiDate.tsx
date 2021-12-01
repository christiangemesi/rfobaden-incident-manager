import React from 'react'

interface Props {
  date: Date
  type?: UiDateType
}

const UiDateLabel: React.VFC<Props> = ({ date, type = 'datetime' }) => {
  switch (type) {
  case 'date':
    return <React.Fragment>{date.getDay()}.{date.getMonth()}.{date.getFullYear()}</React.Fragment>
  case 'time':
    return <React.Fragment>{date.getHours()}:{date.getMinutes()}</React.Fragment>
  case 'datetime':
    return <React.Fragment>{date.getDay()}.{date.getMonth()}.{date.getFullYear()} {date.getHours()}:{date.getMinutes()}</React.Fragment>
  default:
    throw new Error('Invalid type passed to UiDate')
  }
}
export default UiDateLabel

export type UiDateType = 'date' | 'time' | 'datetime'