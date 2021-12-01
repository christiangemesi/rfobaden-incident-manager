import React from 'react'

interface Props {
  date: Date
  type?: UiDateType
}


const UiDateLabel: React.VFC<Props> = ({ date, type = 'date' }) => {
  switch (type) {
  case 'date':
    return <React.Fragment>{date.getDay()}.{date.getMonth()}.{date.getFullYear()}</React.Fragment>
  case 'time':
    return <React.Fragment>{date.getHours()}:{date.getMinutes()}</React.Fragment>
  case 'datetime':
    return <React.Fragment>{date.getDay()}.{date.getMonth()}.{date.getFullYear()} {date.getHours()}:{date.getMinutes()}</React.Fragment>
  default:
    return <React.Fragment>Invalid type passed</React.Fragment> // TODO defualt isn't needed but is it correct to add?
  }
}
export default UiDateLabel

export type UiDateType = 'date' | 'time' | 'datetime'