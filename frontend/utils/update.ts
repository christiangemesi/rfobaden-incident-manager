export default interface Updater<T> {
  (update: T | UpdateFn<T>): void
}

export interface Patcher<T> {
  (patch: Patch<T>): void
}

export interface UpdateFn<T> {
  (prevState: T): T
}

type Patch<T> =
  | PatchFn<T>
  | Partial<T>

export interface PatchFn<T> {
  (prevState: T): Partial<T>
}

export const applyUpdate = <T>(value: T, update: T | UpdateFn<T>): T => {
  if (typeof update === 'function') {
    return (update as UpdateFn<T>)(value)
  }
  return update
}

export const applyPatch = <T>(value: T, patch: Patch<T>): T => {
  if (typeof patch === 'function') {
    return {
      ...value,
      ...patch(value),
    }
  }
  return {
    ...value,
    ...patch,
  }
}

export const toUpdate = <T>(patch: Patch<T>): UpdateFn<T> => {
  return (current) => applyPatch(current, patch)
}

export const makeChildPatcher = <T, K extends keyof T>(patcher: Patcher<T>, key: K): Patcher<T[K]> => {
  return (patch) => patcher((base) => ({
    ...base,
    [key]: applyPatch(base[key], patch),
  }))
}

export const makeChildUpdater = <T, K extends keyof T>(updater: Updater<T>, key: K): Updater<T[K]> => {
  return (update) => updater((base) => ({
    ...base,
    [key]: applyUpdate(base[key], update),
  }))
}
