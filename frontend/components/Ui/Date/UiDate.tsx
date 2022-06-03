import React, { useMemo } from 'react'
import { run } from '@/utils/control-flow'
import DateHelper from '@/utils/helpers/DateHelper'

interface Props {
  /**
   * The date to display.
   */
  value: Date

  /**
   * The display format.
   */
  type?: UiDateType
}

/**
 * `UiDate` displays a formatted date time value.
 */
const UiDate: React.VFC<Props> = ({ value, type = 'auto' }) => {
  const actualType = useMemo(() => {
    if (type !== 'auto') {
      return type
    }
    return DateHelper.isMidnight(value)
      ? 'date'
      : 'datetime'
  }, [type, value])

  // Format the date.
  const day = prefixZero(value.getDate())
  const month = prefixZero(value.getMonth() + 1)
  const year = value.getFullYear()
  const hours = prefixZero(value.getHours())
  const minutes = prefixZero(value.getMinutes())

  return (
    <span suppressHydrationWarning={true}>
      {run(() => {
        switch (actualType) {
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

/**
 * `UiDateType` represents possible formats with which dates can be displayed.
 */
export type UiDateType = 'auto' | 'date' | 'time' | 'datetime'

/**
 * Format a value as a two-digit number.
 *
 * @param value The value.
 * @return The formatted value.
 */
const prefixZero = (value: number): string => {
  if (value < 10) {
    return `0${value}`
  }
  return value.toString()
}
