import Id from '@/models/base/Id'
import { parseDate } from '@/models/base/Date'

export default interface Model extends ModelLike {
  createdAt: Date
  updatedAt: Date
}

interface ModelLike {
  id: Id<this>
}

export type ModelData<T> = ModelFields<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>

type ModelFields<T> = {
  [K in keyof T]:
    T[K] extends ModelLike
      ? ModelData<T[K]>
      : T[K]
}

export type UpdateData<T> = Omit<T, 'id' | 'createdAt'>

export const parseModel = (data: Model): Model => {
  return {
    id: data.id,
    createdAt: parseDate(data.createdAt),
    updatedAt: parseDate(data.updatedAt),
  }
}
