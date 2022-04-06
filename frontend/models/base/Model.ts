import Id from '@/models/base/Id'
import { parseDate } from '@/models/base/Date'

export default interface Model {
  id: Id<this>
  createdAt: Date
  updatedAt: Date
}

export type ModelData<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateData<T> = Omit<T, 'id' | 'createdAt'>

export const parseModel = (data: Model): Model => {
  return {
    id: data.id,
    createdAt: parseDate(data.createdAt),
    updatedAt: parseDate(data.updatedAt),
  }
}
