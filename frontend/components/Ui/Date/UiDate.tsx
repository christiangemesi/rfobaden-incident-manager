import React from 'react'

interface Props {
  value: Date
  type?: UiDateType
}

const UiDate: React.VFC<Props> = ({ value, type = 'datetime' }) => {
  switch (type) {
  case 'date':
    return <React.Fragment>{value.getDay()}.{value.getMonth()}.{value.getFullYear()}</React.Fragment>
  case 'time':
    return <React.Fragment>{value.getHours()}:{value.getMinutes()}</React.Fragment>
  case 'datetime':
    return <React.Fragment>{value.getDay()}.{value.getMonth()}.{value.getFullYear()} {value.getHours()}:{value.getMinutes()}</React.Fragment>
  default:
    throw new Error('Invalid type passed to UiDate')
  }
}
export default UiDate

export type UiDateType = 'date' | 'time' | 'datetime'