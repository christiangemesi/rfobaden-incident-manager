import { createStore } from '@/stores/base/Store'
import { useStore } from '@/stores/base/hooks'
import Alert from '@/models/Alert'

interface AlertState {
  alerts: Alert[]
}

const initialState: AlertState = {
  alerts: [],
}

const AlertStore = createStore(initialState, (getState, setState) => ({

  addAlert(alert: Alert) {
    setState((state) => ({
      alerts:
        [...state.alerts, alert],
    }))
  },

  removeAlert(alert: Alert) {
    const index = getState().alerts.indexOf(alert)
    setState((state) => ({
      alerts:
        state.alerts.splice(index, 1),
    }))
  },
}))

export default AlertStore

export const useAlerts = (): Alert[] => {
  const { alerts } = useStore(AlertStore)
  return alerts
}
