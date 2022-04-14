import Id from '@/models/base/Id'

export enum ReportTypeType {
  TELEFON = 'TELEFON',
  EMAIL = 'EMAIL',
  FUNK = 'FUNK',
  KP_FRONT = 'KP_FRONT',
  KP_RUECK = 'KP_RUECK',
  MELDELAUUFER = 'MELDELAUUFER',
  FAX = 'FAX',
}

export default interface ReportType {
  id: Id<this>
  type: ReportTypeType
  number: string | null
}

export const parseReportType = (data: ReportType): ReportType => ({
  ...data,
})
