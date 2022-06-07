/**
 * `Updater` is a function that replaces a value.
 */
export default interface Updater<T> {
  /**
   * Updates a value.
   *
   * @param update Either a new value, or a {@link UpdateFn}.
   */
  (update: T | UpdateFn<T>): void
}

/**
 * `Patcher` is a function that changes parts of a value.
 * <p>
 *   Unlike {@link Updater}, this allows for partial updates - changing only certain fields.
 * </p>
 */
export interface Patcher<T> {
  /**
   * Applies a patch to a value.
   *
   * @param patch The patch to apply.
   */
  (patch: Patch<T>): void
}

/**
 * `UpdateFn` is a function that creates a new value based on an old one.
 */
export interface UpdateFn<T> {
  /**
   * Creates a new value based on an old one.
   *
   * @param prevState The old value.
   */
  (prevState: T): T
}

/**
 * `Patch` is a collection of types which can patch a value.
 */
export type Patch<T> =
  | PatchFn<T>
  | Partial<T>

/**
 * `PatchFn` is a function that creates a patch value based on the current value.
 */
export interface PatchFn<T> {
  /**
   * Creates a patch value based on the current value.
   *
   * @param prevState The current value.
   * @return A value containing the fields that should be updated.
   */
  (prevState: T): Partial<T>
}

export const applyUpdate = <T>(value: T, update: T | UpdateFn<T>): T => {
  if (typeof update === 'function') {
    return (update as UpdateFn<T>)(value)
  }
  return update
}

/**
 * Applies a {@link Patch} to a value.
 *
 * @param value The value to patch.
 * @param patch The patch to apply.
 */
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

/**
 * Creates an {@link UpdateFn} based on a {@link Patch}.
 *
 * @param patch The patch from which the update is created.
 */
export const toUpdate = <T>(patch: Patch<T>): UpdateFn<T> => {
  return (current) => applyPatch(current, patch)
}

/**
 * Creates a {@link Patcher} that patches only a specific field of another patcher's value.
 *
 * @param patcher The parent patcher.
 * @param key The key of the field to patch.
 */
export const makeChildPatcher = <T, K extends keyof T>(patcher: Patcher<T>, key: K): Patcher<T[K]> => {
  return (patch) => patcher((base) => ({
    ...base,
    [key]: applyPatch(base[key], patch),
  }))
}

/**
 * Creates a {@link Updater} that updates only a specific field of another updater's value.
 *
 * @param updater The parent updater.
 * @param key The key of the field to update.
 */
export const makeChildUpdater = <T, K extends keyof T>(updater: Updater<T>, key: K): Updater<T[K]> => {
  return (update) => updater((base) => ({
    ...base,
    [key]: applyUpdate(base[key], update),
  }))
}
