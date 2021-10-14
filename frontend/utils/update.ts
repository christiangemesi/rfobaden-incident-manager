export default interface Update<T> {
  (patch: Partial<T> | ((prevState: T) => Partial<T>)): void
}
