import React, { useMemo } from 'react'
import UiDate, { UiDateType } from '@/components/Ui/Date/UiDate'
import DateHelper from '@/utils/helpers/DateHelper'

interface Props {
  /**
   * The start of a date range.
   */
  start: Date

  /**
   * The end of a date range, or `null` if the range has no end.
   */
  end?: Date | null

  /**
   * The date's format.
   */
  type?: UiDateType
}

/**
 * `UiDateLabel` displays a formatted date time range.
 */
const UiDateLabel: React.VFC<Props> = ({ start, end = null, type = 'auto' }) => {
  const dateType = useMemo(() => {
    if (type !== 'auto') {
      return type
    }
    return DateHelper.isDayRange(start, end) ? 'date' : 'datetime'
  }, [type, start, end])

  return (
    <span suppressHydrationWarning={true}>
      {end === null ? (
        <React.Fragment>
          <UiDate value={start} type={dateType} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p><UiDate value={start} type={dateType} /> - <UiDate value={end} type={dateType} /></p>
        </React.Fragment>
      )}
    </span>
  )
}
export default UiDateLabel
