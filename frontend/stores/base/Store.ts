import Id from '@/models/base/Id'
import { applyPatch, Patch, Patcher } from '@/utils/update'
import Model from '@/models/base/Model'
import { run } from '@/utils/control-flow'

export const privateKey = Symbol('store/private')

export interface Store<T> {
  readonly [privateKey]: StoreInternals<T>
}

export interface ModelStore<T> extends Store<ModelStoreState<T>> {
  list(ids?: Id<T>[]): readonly T[]
  find(id: Id<T>): T | null
  save(record: T, options?: ModelSaveOptions): void
  saveAll(records: Iterable<T>): void
  remove(id: Id<T>): void

  onCreate(receive: RecordListener<T>): Unregister
  onUpdate(receive: ChangeListener<T>): Unregister
  onRemove(receive: RecordListener<T>): Unregister
  onSave(receive: ChangeListener<T,  T |null>): Unregister

  readonly [privateKey]: ModelStoreInternals<T>
}

interface ModelSaveOptions {
  index?: number
}

interface CreateStoreActions<T, S> {
  (getState: () => T, setState: Patcher<T>): S
}

export interface ModelStoreState<T> {
  list: readonly T[]
  mapping: Readonly<ModelStoreMapping<T>>
}

type ModelStoreMapping<T> = Record<Id<T>, T>

interface ModelStoreExtensionActions<T> {
  sortBy?: SortBy<T>
}

interface SortBy<T> {
  (record: T): Array<unknown | [unknown, 'desc']>
}

interface RecordListener<T> {
  (record: T): void
}

interface ChangeListener<T, O = T> {
  (newRecord: T, oldRecord: O): void
}

interface Unregister {
  (): void
}


interface StoreInternals<T> {
  state: T
  listeners: Array<(state: T) => void>
}

interface ModelStoreInternals<T> extends StoreInternals<ModelStoreState<T>> {
  parse: (record: T) => T
}

/**
 * Creates a new store.
 *
 * @param initialState The stores' initial state.
 * @param actions Initializes the fields which will be available on the store.
 */
export const createStore = <T, S>(initialState: T, actions: CreateStoreActions<T, S>): Store<T> & S => {
  const internals: StoreInternals<T> = {
    state: initialState,
    listeners: [],
  }
  const getState = () => internals.state
  const setState: Patcher<T> = (patch) => runPatch(internals, patch)
  return {
    ...actions(getState, setState),
    [privateKey]: internals,
  }
}

/**
 * Creates a new model store.
 * @param parseRecord Parses plain objects into storable records.
 */
export function createModelStore<T extends Model>(parseRecord: (value: T) => T): ModelStore<T>

/**
 * Creates a new model store with additional custom actions.
 * @param parseRecord Parses plain objects into storable records.
 * @param actions The stores' custom actions.
 */
export function createModelStore<T extends Model, S extends ModelStoreExtensionActions<T>>(parseRecord: (value: T) => T, actions: S): ModelStore<T> & Omit<S, keyof ModelStoreExtensionActions<T>>

export function createModelStore<T extends Model, S extends ModelStoreExtensionActions<T>>(parseRecord: (value: T) => T, actions?: S): ModelStore<T> & Omit<S, keyof ModelStoreExtensionActions<T>> {
  const initialState: ModelStoreState<T> = {
    list: [],
    mapping: {},
  }

  const compare = actions?.sortBy ? createModelCompareFunction(actions.sortBy) : undefined

  const createListeners: RecordListener<T>[] = []
  const updateListeners: ChangeListener<T>[] = []
  const removeListeners: RecordListener<T>[] = []

  /**
   * Adds a listener to a listener array and returns an unregister function.
   * @param listeners The listener array to store the listener in.
   * @param listener The listener to register.
   * @returns a function which unregisters the listener when called.
   */
  const registerListener = <F>(listeners: F[], listener: F): () => void => {
    listeners.push(listener)
    return () => {
      const i = listeners.indexOf(listener)
      if (i !== -1) {
        listeners.splice(i, 1)
      }
    }
  }

  /**
   * Find the index at which a new record should be inserted into the stores' list.
   * If the new record should be inserted at the end of the list, then `records.length` is returned.
   *
   * @param records The list of currently stored records.
   * @param newRecord The record to be stored.
   *
   * @returns the index at which the new record should be inserted.
   */
  const getStoreIndexOf = (records: T[], newRecord: T): number => {
    if (compare === undefined) {
      return records.length
    }
    for (let i = 0; i < records.length; i++) {
      const record = records[i]
      const diff = compare(record, newRecord)
      if (diff === 0) {
        return i + 1
      }
      if (diff > 0) {
        return i
      }
    }
    return records.length
  }

  /**
   * Saves a record into a mutable state.
   * @param state The state to insert into.
   * @param record The record to save.
   * @param index The index at which the record should be inserted. If left `undefined`,
   *              a fitting position will be determined using the stores' sort configuration.
   *
   * @returns `true` if the new value was added, `false` if it was equal to its old entry and was thus skipped.
   */
  const save = (state: { list: T[], mapping: ModelStoreMapping<T> }, record: T, index?: number): boolean => {
    const oldRecord = state.mapping[record.id] ?? null
    if (index === undefined && oldRecord !== null && deepEqual(oldRecord, record)) {
      return false
    }
    state.mapping[record.id] = record
    if (oldRecord !== null) {
      state.list.splice(state.list.indexOf(oldRecord), 1)
      afterStorePatch(() => updateListeners.forEach((listen) => listen(record, oldRecord)))
    } else {
      afterStorePatch(() => createListeners.forEach((listen) => listen(record)))
    }
    const i = index ?? getStoreIndexOf(state.list, record)
    state.list.splice(i, 0, record)
    return true
  }

  const store = createStore(initialState, (getState, setState) => ({
    ...((actions === undefined ? {} : actions) as S),
    list(ids?: Id<T>[]): readonly T[] {
      const state = getState()
      if (ids === undefined) {
        return state.list
      }
      const result = [] as T[]
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i]
        const record = state.mapping[id]
        if (record === undefined) {
          throw new Error(`id not found in store: ${id}`)
        }
        result.push(record)
      }
      return result
    },
    find(id: Id<T>): T | null {
      const { mapping } = getState()
      return mapping[id] ?? null
    },
    save: (record: T, options: ModelSaveOptions = {}): void => setState((state) => {
      const newState = {
        list: [...state.list],
        mapping: { ...state.mapping },
      }
      if (!save(newState, record, options.index)) {
        return state
      }
      return newState
    }),
    saveAll: (records: Iterable<T>): void => setState((state) => {
      const newState = {
        list: [...state.list],
        mapping: { ...state.mapping },
      }
      let changeCount = 0
      for (const record of records) {
        changeCount += save(newState, record) ? 1 : 0
      }
      if (changeCount === 0) {
        return state
      }
      return newState
    }),
    remove: (id: Id<T>): void => setState((state) => {
      const record = state.mapping[id]
      if (record === undefined) {
        return state
      }
      const newState = {
        list: [...state.list],
        mapping: { ...state.mapping },
      }
      newState.list.splice(newState.list.indexOf(record), 1)
      delete newState.mapping[id]
      afterStorePatch(() => removeListeners.forEach((listen) => listen(record)))
      return newState
    }),
    onCreate: (listen: RecordListener<T>): Unregister => (
      registerListener(createListeners, listen)
    ),
    onUpdate: (listen: ChangeListener<T>): Unregister => (
      registerListener(updateListeners, listen)
    ),
    onRemove: (listen: RecordListener<T>): Unregister => (
      registerListener(removeListeners, listen)
    ),
    onSave(listen: ChangeListener<T, T | null>): Unregister {
      const unregisterCreate = registerListener(createListeners, (record) => listen(record, null))
      const unregisterUpdate = registerListener(updateListeners, listen)
      return () => {
        unregisterCreate()
        unregisterUpdate()
      }
    },
    [privateKey]: null as unknown as ModelStoreInternals<T>,
  }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(store as any)[privateKey].parse = parseRecord
  return store as ModelStore<T> & Exclude<S, ModelStoreExtensionActions<T>>
}


const createModelCompareFunction = <T>(sortBy: SortBy<T>) => (recordA: T, recordB: T): number => {
  const as = sortBy(recordA)
  const bs = sortBy(recordB)

  for (let i = 0; i < as.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const valueA = as[i] as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const valueB = bs[i] as any

    const [a, b, factor] = Array.isArray(valueA) && valueA.length === 2
      ? [valueA[0], valueB[0], 1]
      : [valueA, valueB, -1]

    if (a === b) {
      continue
    }
    const result = run(() => {
      if (a == null) {
        return -1
      }
      if (b == null) {
        return 1
      }
      if (a < b) {
        if (a > b) {
          throw new Error(`values are not comparable: ${a} <=> ${b}`)
        }
        return -1
      }
      return 1
    })
    return result * factor
  }
  return 0
}

/**
 * `delayedPatches` contains patches queued to `runPatch` which have been delayed because they happened while
 * another patch was being executed. This is tracked globally, over all possible stores,
 * since the state of stores might depend on other stores, causing a chain effect.
 *
 * `delayedPatches` is `null` if no other patch is currently running.
 */
let delayedPatches: Array<[StoreInternals<unknown>, Patch<unknown>]> | null = null

/**
 * Applies a patch to the state of a store.
 * The patch is not guaranteed to be applied instantly, but might instead be delayed for later.
 *
 * @param internals The internals of the store whose state is getting patched.
 * @param patch The patch being applied to the stores' state.
 */
const runPatch = <T>(internals: StoreInternals<T>, patch: Patch<T>) => {
  // Delay the patch if there's currently another one running.
  if (delayedPatches !== null) {
    delayedPatches.push([internals as StoreInternals<unknown>, patch])
    return
  }

  // Set global buffers to empty values to signal that a patch is now being executed.
  delayedPatches = []
  afterPatchCallbacks = new Set()

  // Backup the current state, so we can compare to it after applying the patch.
  const oldState = internals.state

  // Apply the patch to the current state and store the result.
  internals.state = applyPatch(internals.state, patch)

  // Run any delayed patches and reset the global patch state.
  const delayedInternals = runDelayedPatches()

  // Broadcast the change to the listeners, if anything has changed at all.
  if (oldState !== internals.state) {
    internals.listeners.forEach((listener) => listener(internals.state))
  }
  for (const [internals, oldState] of delayedInternals) {
    if (internals.state !== oldState) {
      internals.listeners.forEach((listener) => listener(internals.state))
    }
  }

  // Run any after-patch callbacks, and reset them.
  runAfterPatchCallbacks()
}

/**
 * Run any delayed patches and reset the global patch state.
 *
 * @returns A map of internals whose listeners haven't received the newest state update yet.
 */
const runDelayedPatches = (): Map<StoreInternals<unknown>, unknown> => {
  const delayedInternals = new Map()

  while (delayedPatches !== null && delayedPatches.length !== 0) {
    // Get all delayed patches and reset the global patch buffer.
    const patches = delayedPatches
    delayedPatches = []

    // Apply the delayed patches.
    // If these patches trigger other patches, they will get executed in the next while iteration.
    for (const [internals, patch] of patches) {
      if (!delayedInternals.has(internals)) {
        delayedInternals.set(internals, internals.state)
      }
      internals.state = applyPatch(internals.state, patch)
    }
  }

  delayedPatches = null
  return delayedInternals
}

/**
 * `afterPatchCallbacks` contains callbacks that are executed right after `runPatch`.
 * They are only executed once, and then removed from the array.
 *
 * `afterPatchCallbacks` is `null` if no patch is currently running.
 */
let afterPatchCallbacks: Set<() => void> | null = null

/**
 * Run a callback after the current store patch has finished.
 * If no patch is currently running, the callback is executed immediately.
 * @param callback The callback to execute.
 */
export const afterStorePatch = (callback: () => void): void => {
  if (afterPatchCallbacks === null) {
    callback()
  } else {
    afterPatchCallbacks.add(callback)
  }
}

/**
 * Run all callbacks in `afterPatchCallbacks` and reset it to its default value.
 */
const runAfterPatchCallbacks = () => {
  if (afterPatchCallbacks !== null) {
    const callbacks = afterPatchCallbacks
    afterPatchCallbacks = null
    for (const callback of callbacks) {
      callback()
    }
  }
}

/**
 * Deep compare two values two each other.
 * @param a The first value.
 * @param b The second value.
 * @returns `true` if `a` and `b` are deeply equal to each other.
 */
const deepEqual = (a: unknown, b: unknown): boolean => {
  if (Object.is(a, b)) {
    return true
  }
  if (typeof a !== typeof b) {
    return false
  }
  if (typeof a !== 'object' || typeof b !== 'object') {
    return false
  }
  if (a === null) {
    return b === null
  }
  if (b === null) {
    return false
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      return false
    }
    if (a.length !== b.length) {
      return false
    }
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) {
        return false
      }
    }
    return false
  }
  if (a instanceof Date) {
    return b instanceof Date && a.getTime() === b.getTime()
  }
  const aKeys = Object.keys(a)
  for (const key of Object.keys(a)) {
    if (!(key in b)) {
      return false
    }
    const av = a[key]
    const bv = b[key]
    if (!deepEqual(av, bv)) {
      return false
    }
  }
  return aKeys.length === Object.keys(b).length
}
