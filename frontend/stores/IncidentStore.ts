import { createModelStore } from '@/stores/Store'
import Incident, { parseIncident } from '@/models/Incident'

const [IncidentStore, useIncidents, useIncident] = createModelStore(parseIncident)
export default IncidentStore

export {
  useIncidents,
  useIncident,
}
