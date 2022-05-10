import React from 'react'
import UiAlert from '@/components/Ui/Alert/UiAlert'
import UiAlertList from '@/components/Ui/Alert/List/UiAlertList'
import Alert from '@/models/Alert'
import AlertStore, { useAlerts } from '@/stores/AlertStore'
import { useEffectOnce } from 'react-use'

const UiAlertExample: React.VFC = () => {

  const remove = (alert: Alert) => {
    AlertStore.removeAlert(alert)
  }

  useEffectOnce(() => {
    AlertStore.addAlert({ text: 'Beispiel', type: 'warning' })
  })


  const alerts = useAlerts()

  return (
    <UiAlertList>
      {alerts.map((alert, idx) =>
        <UiAlert key={idx} text={alert.text} type={alert.type} onRemove={() => remove(alert)}></UiAlert>,
      )}
    </UiAlertList>
  )
}
export default UiAlertExample
