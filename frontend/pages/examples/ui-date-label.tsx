import React from 'react'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'

/**
 * `UiDateLabelExample` is an example page for the {@link UiDateLabel} component.
 */
const UiDateLabelExample: React.VFC = () => {
  const past = new Date(2018, 11, 24)
  const now = new Date()
  const future = new Date()
  future.setFullYear(now.getFullYear() + 1)

  return (
    <React.Fragment>
      <h2>UiBadge</h2>
      <UiDateLabel start={past} end={now} />
      <br />
      <UiDateLabel start={now} end={future} type="datetime" />
      <br />
      <UiDateLabel start={now} />
      <br />
      <UiDateLabel start={past} />
    </React.Fragment>
  )
}
export default UiDateLabelExample
