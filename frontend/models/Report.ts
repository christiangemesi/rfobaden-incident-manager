import Model from '@/models/base/Model'
import { parseDate } from '@/models/Date'

export default interface Report extends Model {
  title: string
  authorId: number
  description: string | null
  closeReason: string | null
  isClosed: boolean
  createdAt: Date
  updatedAt: Date
  startsAt: Date | null
  endsAt: Date | null
}

export const parseReport = (data: unknown): Report => {
  const report = data as Report
  return {
    ...report,
    createdAt: parseDate(report.createdAt),
    updatedAt: parseDate(report.updatedAt),
    startsAt: parseDateOrNull(report.startsAt),
    endsAt: parseDateOrNull(report.endsAt),
  }
}

const parseDateOrNull = (date: Date | null): Date | null => {
  return date === null ? null : parseDate(date)
}