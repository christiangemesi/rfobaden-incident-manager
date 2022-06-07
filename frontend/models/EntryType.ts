import Id from '@/models/base/Id'

/**
 * `EntryTypeSource` represents possible sources which can cause a report to be created.
 */
export enum EntryTypeSource {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  RADIO = 'RADIO',
  KP_FRONT = 'KP_FRONT',
  KP_BACK = 'KP_BACK',
  REPORTER = 'REPORTER',
  FAX = 'FAX',
}

/**
 * `EntryType` describes how a {@link Report} was reported, i.e. who or what caused it to be created.
 */
export default interface EntryType {
  id: Id<this>
  source: EntryTypeSource
  descriptor: string | null
}

/**
 * Parses an entry type's JSON structure.
 *
 * @param data The entry type to parse.
 * @return The parsed entry type.
 */
export const parseEntryType = (data: EntryType): EntryType => ({
  ...data,
})
