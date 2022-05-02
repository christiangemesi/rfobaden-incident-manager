import Id from '@/models/base/Id'

export enum EntryTypeSource {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  RADIO = 'RADIO',
  KP_FRONT = 'KP_FRONT',
  KP_BACK = 'KP_BACK',
  REPORTER = 'REPORTER',
  FAX = 'FAX',
}

export default interface EntryType {
  id: Id<this>
  source: EntryTypeSource
  number: string | null
}

export const parseEntryType = (data: EntryType): EntryType => ({
  ...data,
})
