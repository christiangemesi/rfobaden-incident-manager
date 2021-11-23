import { parseDate } from '@/models/Date'
import { parseCompletable } from '@/models/Completable'

export default interface Completion {
  reason: string
  createdAt: Date
  previous: Completion | null
}

export const parseCompletion = (completion: Completion): Completion => {
  return {
    ...completion,
    createdAt: parseDate(completion.createdAt),
    previous: completion.previous && parseCompletion(completion.previous),
  }
}
