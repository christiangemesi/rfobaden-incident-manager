import { parseDate } from '@/models/base/Date'

export default interface CloseReason {
  message: string
  createdAt: Date
  previous: CloseReason | null
}

export const parseCloseReason = (closeReason: CloseReason): CloseReason => {
  return {
    ...closeReason,
    createdAt: parseDate(closeReason.createdAt),
    previous: closeReason.previous && parseCloseReason(closeReason.previous),
  }
}
