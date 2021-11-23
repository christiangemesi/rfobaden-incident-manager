import Completion, { parseCompletion } from '@/models/Completion'

export default interface Completable {
  completion: Completion | null
  isComplete: boolean
}

export const parseCompletable = ({ completion, isComplete }: Completable): Completable => ({
  completion: completion && parseCompletion(completion),
  isComplete,
})
