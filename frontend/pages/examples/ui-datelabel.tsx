import React from 'react'
import UiDataLabel from '@/components/Ui/DataLabel/UiDataLabel'

const UiDateLabelExample: React.VFC = () => {
  const past = new Date(2018, 11, 24)
  const now = new Date()
  return (
    <React.Fragment>
      <h2>UiBadge</h2>
      <UiDataLabel firstDate={past} secondDate={now} />
      <UiDataLabel firstDate={now} />
    </React.Fragment>
  )
}
export default UiDateLabelExample
