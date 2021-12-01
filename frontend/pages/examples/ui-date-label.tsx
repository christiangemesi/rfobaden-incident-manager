import React from 'react'
import UiDataLabel from '@/components/Ui/DataLabel/UiDateLabel'

const UiDateLabelExample: React.VFC = () => {
  const past = new Date(2018, 11, 24)
  const now = new Date()
  const future = new Date()
  future.setFullYear(now.getFullYear() + 1)
  return (
    <React.Fragment>
      <h2>UiBadge</h2>
      <UiDataLabel start={past} end={now} />
      <br />
      <UiDataLabel start={now} end={future} type="datetime" />
      <br />
      <UiDataLabel start={now} />
      <br />
      <UiDataLabel start={past} />
    </React.Fragment>
  )
}
export default UiDateLabelExample
