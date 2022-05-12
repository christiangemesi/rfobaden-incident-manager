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

const AlertStore = createStore(initialState, (state, update) => ({
  add(alert: Omit<Alert, 'id'>) {
    update(() => {
      state.alerts.push({ ...alert, id: nextId++ })
    })
  },

  remove(alert: Alert) {
    update(() => {
      const index = state.alerts.indexOf(alert)
      if (index === -1){
        return false
      }
      state.alerts.splice(index, 1)
    })


  },
}))

export default AlertStore

export const useAlerts = (): Alert[] => {
  const { alerts } = useStore(AlertStore)
  return alerts
}
