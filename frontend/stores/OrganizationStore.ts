import { createModelStore } from '@/stores/base/Store'
import { parseOrganization } from '@/models/Organization'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'

/**
 * `OrganizationStore` manages all loaded {@link Organization organizations}.
 */
const OrganizationStore = createModelStore(parseOrganization)
export default OrganizationStore

/**
 * `useOrganization` is a React hook which loads a specific organization from {@link OrganizationStore}.
 * It re-renders whenever the organization is changed.
 *
 * @param id The id of the organization.
 * @return The organization.
 */
export const useOrganization = createUseRecord(OrganizationStore)


/**
 * `useOrganizations` is a React hook that loads all organizations from {@link OrganizationStore}.
 * It re-renders whenever the store is modified.
 *
 * @param idsOrTransform? An list of ids to load, or a function that modifies the returned list.
 * @return The list of organizations.
 */
export const useOrganizations = createUseRecords(OrganizationStore)
