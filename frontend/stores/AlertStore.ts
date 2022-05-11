import { createStore } from '@/stores/base/Store'
import { useStore } from '@/stores/base/hooks'
import Alert from '@/models/Alert'

interface AlertState {
  alerts: Alert[]
}

const initialState: AlertState = {
  alerts: [],
}

let nextId = 0

const AlertStore = createStore(initialState, (getState, setState) => ({

  add(alert: Omit<Alert, 'id'>) {
    setState((state) => ({
      alerts:
        [...state.alerts, { ...alert, id: nextId++ }],
    }))
  },

  remove(alert: Alert) {
    const index = getState().alerts.indexOf(alert)
    if(index !== -1){
      const newState = [...getState().alerts]
      newState.splice(index, 1)
      setState({
        alerts:
          newState,
      })
    }
  },
}))

export default AlertStore

export const useAlerts = (): Alert[] => {
  const { alerts } = useStore(AlertStore)
  return alerts
}
