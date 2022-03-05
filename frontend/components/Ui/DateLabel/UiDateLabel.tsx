import React, { useMemo } from 'react'
import UiDate, { UiDateType } from '@/components/Ui/Date/UiDate'

interface Props {
  start: Date
  end?: Date | null
  type?: UiDateType
}

const UiDateLabel: React.VFC<Props> = ({ start, end = null, type = 'date' }) => {
  const prefix = useMemo(() => start < new Date() ? 'seit' : 'ab', [start])
  return (
    <span suppressHydrationWarning={true}>
      {end === null ? (
        <React.Fragment>
          {prefix} <UiDate value={start} type={type} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          von <UiDate value={start} type={type} /> bis <UiDate value={end} type={type} />
        </React.Fragment>
      )}

    </span>
  )
}
export default UiDateLabel