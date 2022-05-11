import React, { useState } from 'react'
import UiAlert from '@/components/Ui/Alert/UiAlert'
import UiAlertList from '@/components/Ui/Alert/List/UiAlertList'
import Alert from '@/models/Alert'

const UiAlertExample: React.VFC = () => {

  const [alerts, setAlerts] = useState<Alert[]>(
    [
      { id: 1, text: 'Info Message', type: 'info', isFading: true },
      { id: 2, text: 'Warning Message', type: 'warning', isFading: false },
      { id: 3, text: 'Error Message', type: 'error', isFading: false },
      { id: 4, text: 'Success Message', type: 'success', isFading: true },
    ],
  )

  const handleRemove = (alert: Alert) => setAlerts((allAlerts) => {
    const index = allAlerts.indexOf(alert)
    if (index !== -1) {
      const newAlerts = [...allAlerts]
      newAlerts.splice(index, 1)
      return newAlerts
    }
    return allAlerts
  })

  return (
    <UiAlertList>
      {alerts.map((alert) =>
        <UiAlert key={alert.id} alert={alert} onRemove={handleRemove} />,
      )}
    </UiAlertList>
  )
}
export default UiAlertExample
