import CloseReason, { parseCloseReason } from '@/models/CloseReason'

export default interface Completable {
  completion: CloseReason | null
  isComplete: boolean
}

export const parseCompletable = ({ completion, isComplete }: Completable): Completable => ({
  completion: completion && parseCloseReason(completion),
  isComplete,
})
