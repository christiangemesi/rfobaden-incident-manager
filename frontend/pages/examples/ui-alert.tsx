import React, { useState } from 'react'
import UiAlert from '@/components/Ui/Alert/UiAlert'
import UiAlertList from '@/components/Ui/Alert/List/UiAlertList'

const UiAlertExample : React.VFC = () => {
  const [isVisible, setVisible] = useState(true)
  return (
    <UiAlertList>
      {isVisible && (
        <UiAlert type="info"  text="Das ist die Meldung" onRemove={() => setVisible(false)} />
      )}
    </UiAlertList>
  )
}
export default UiAlertExample
