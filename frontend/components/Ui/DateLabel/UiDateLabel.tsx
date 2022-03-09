import React, { useMemo } from 'react'
import UiDate, { UiDateType } from '@/components/Ui/Date/UiDate'
import DateHelper from '@/utils/helpers/DateHelper'

interface Props {
  start: Date
  end?: Date | null
  type?: UiDateType | 'auto'
}

const UiDateLabel: React.VFC<Props> = ({ start, end = null, type = 'auto' }) => {
  const prefix = useMemo(() => start < new Date() ? 'seit' : 'ab', [start])
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
          {prefix} <UiDate value={start} type={dateType} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          von <UiDate value={start} type={dateType} /> bis <UiDate value={end} type={dateType} />
        </React.Fragment>
      )}

    </span>
  )
}
export default UiDateLabel
