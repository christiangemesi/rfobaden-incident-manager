import { createModelStore } from '@/stores/Store'
import { parseIncident } from '@/models/Incident'

const [IncidentStore, useIncidents, useIncident] = createModelStore(parseIncident)
export default IncidentStore

export {
  useIncidents,
  useIncident,
}
