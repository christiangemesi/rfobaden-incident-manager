import { createStore } from '@/stores/base/Store'
import { useStore } from '@/stores/base/hooks'
import Alert from '@/models/Alert'

interface AlertState {
  alerts: Alert[]
}

/**
 * The initial state of the `AlertStore`.
 */
const initialState: AlertState = {
  alerts: [],
}

/**
 * `nextId` is used to generate the unique identifier for each {@link Alert}.
 * This value will be incremented by creating {@link Alert alerts}.
 */
let nextId = 0

/**
 * `AlertStore` is used to store {@link Alert alerts} globally.
 * These alerts are displayed by using a {@link UiAlertList}.
 */
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

/**
 * @returns All {@link Alert alerts} which are stored in the `AlertStore`.
 */
export const useAlerts = (): Alert[] => {
  const { alerts } = useStore(AlertStore)
  return alerts
}
