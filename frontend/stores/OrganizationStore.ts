import { createModelStore } from '@/stores/Store'
import { parseOrganization } from '@/models/Organization'
import Id from '@/models/base/Id'
import Incident from '@/models/Incident'

const [OrganizationStore, useOrganizations, useOrganization] = createModelStore(parseOrganization)
export default OrganizationStore

export {
  useOrganizations,
  useOrganization,
}

export const useOrganizationsOfIncident = (incidentId: Id<Incident>) => {
  throw new Error('nyi')
}
