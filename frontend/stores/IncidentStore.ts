import { createModelStore } from '@/stores/Store'
import Incident from '@/models/Incident'

const [IncidentStore, useIncidents, useIncident] = createModelStore<Incident>()({})
export default IncidentStore

export {
  useIncidents,
  useIncident,
}
