import { createStore } from '@/stores/base/Store'
import { useStore } from '@/stores/base/hooks'

interface AlertState {
  alerts: string[]
}

const initialState: AlertState = {
  alerts: [],
}

const AlertStore = createStore(initialState, (getState, setState) => ({

  addAlert(alert: string) {
    setState((state) => ({
      alerts:
        [...state.alerts, alert],
    }))
  },

  removeAlert(alert: string) {
    const index = getState().alerts.indexOf(alert)
    setState({
      alerts:
        getState().alerts.splice(index, 1),
    })
  },
}))

export default AlertStore

export const useAlerts = (): string[] => {
  const { alerts } = useStore(AlertStore)
  return alerts
}
