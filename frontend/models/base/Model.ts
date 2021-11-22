import Id from '@/models/base/Id'
import { parseDate } from '@/models/Date'

export default interface Model {
  id: Id<this>
  createdAt: Date
  updatedAt: Date
}

export type ModelData<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

export const parseModel = (data: unknown): Model => {
  const record = data as Model
  return {
    id: record.id,
    createdAt: parseDate(record.createdAt),
    updatedAt: parseDate(record.updatedAt),
  }
}
