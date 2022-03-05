import React from 'react'
import { run } from '@/utils/control-flow'

interface Props {
  value: Date
  type?: UiDateType
}

const UiDate: React.VFC<Props> = ({ value, type = 'datetime' }) => {
  const day = prefixZero(value.getDate())
  const month = prefixZero(value.getMonth() + 1)
  const year = value.getFullYear()
  const hours = prefixZero(value.getHours())
  const minutes = prefixZero(value.getMinutes())
  return (
    <span suppressHydrationWarning={true}>
      {run(() => {
        switch (type) {
        case 'date':
          return <React.Fragment>{day}.{month}.{year}</React.Fragment>
        case 'time':
          return <React.Fragment>{hours}:{minutes}</React.Fragment>
        case 'datetime':
          return <React.Fragment>{day}.{month}.{year} {hours}:{minutes}</React.Fragment>
        default:
          throw new Error('Invalid type passed to UiDate')
        }
      })}
    </span>
  )
}
export default UiDate

export type UiDateType = 'date' | 'time' | 'datetime'

const prefixZero = (value: number): string => {
  if (value < 10) {
    return `0${value}`
  }
  return value.toString()
}
