import { createModelStore } from '@/stores/base/Store'
import { parseOrganization } from '@/models/Organization'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'

const OrganizationStore = createModelStore(parseOrganization)

export default OrganizationStore

export const useOrganization = createUseRecord(OrganizationStore)
export const useOrganizations = createUseRecords(OrganizationStore)

