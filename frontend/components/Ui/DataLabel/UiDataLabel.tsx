import React from 'react'

interface Props {
  firstDate: Date,
  secondDate?: Date | null
}

const UiDateLabel: React.VFC<Props> = ({ firstDate, secondDate = null }) => {
  if (secondDate !== null) {
    return <div>von {firstDate.toLocaleDateString()} bis {secondDate.toLocaleDateString()}</div>
  }
  return <div>seit {firstDate.toLocaleDateString()}</div>
}
export default UiDateLabel