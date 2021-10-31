export default interface Update<T> {
  (update: T | UpdateFn<T>): void
}

export interface PartialUpdate<T> {
  (patch: Partial<T> | PartialUpdateFn<T>): void
}

export interface UpdateFn<T> {
  (prevState: T): T
}

export interface PartialUpdateFn<T> {
  (prevState: T): Partial<T>
}
