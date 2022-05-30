import Id from '@/models/base/Id'

/**
 * `EntryTypeSource` represents types how a reporter can come in.
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
 * `EntryType` represents the type how a {@link Report} comes in and
 * how the reporter can be contacted.
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
