import { createModelStore } from '@/stores/Store'
import { parseOrganization } from '@/models/Organization'

const [OrganizationStore, useOrganizations, useOrganization] = createModelStore(parseOrganization)
export default OrganizationStore

export {
  useOrganizations,
  useOrganization,
}
