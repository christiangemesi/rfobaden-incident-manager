import Id from '@/models/base/Id'

export enum EntryTypeType {
  TELEFON = 'TELEFON',
  EMAIL = 'EMAIL',
  FUNK = 'FUNK',
  KP_FRONT = 'KP_FRONT',
  KP_RUECK = 'KP_RUECK',
  MELDELAUUFER = 'MELDELAUUFER',
  FAX = 'FAX',
}

export default interface EntryType {
  id: Id<this>
  type: EntryTypeType
  number: string | null
}

export const parseEntryType = (data: EntryType): EntryType => ({
  ...data,
})
