import Id from '@/models/base/Id'

export default interface Model {
  id: Id<this>
}

export type ModelData<T> = Omit<T, 'id'>
