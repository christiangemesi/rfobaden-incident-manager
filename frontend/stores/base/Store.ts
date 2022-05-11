import Id from '@/models/base/Id'
import Model from '@/models/base/Model'
import { run } from '@/utils/control-flow'

export const privateKey = Symbol('store/private')

export interface Store<T> {
  readonly [privateKey]: StoreInternals<T>
}

/**
 * `StoreInternals` holds the private data of a {@link Store}.
 */
interface StoreInternals<T> {
  /**
   * The current state of the store.
   */
  state: T

  /**
   * The store listeners, consisting of an array of functions.
   * The functions get called when the {@link state} of the store changes.
   */
  listeners: Array<() => void>

  /**
   * The id of the current iteration of this store's state.
   * This number is changed whenever the state is updated.
   */
  id: number
}

/**
 * A `ModelStore` is a store that provides simple CRUD operations on a {@link Model}.
 */
export interface ModelStore<T> extends Store<ModelStoreState<T>> {
  list(ids?: Id<T>[]): readonly T[]
  find(id: Id<T>): T | null
  save(record: T, options?: ModelSaveOptions): void
  saveAll(records: Iterable<T>): void
  remove(id: Id<T>): void

  onCreate(receive: RecordListener<T>): Unregister
  onUpdate(receive: ChangeListener<T>): Unregister
  onRemove(receive: RecordListener<T>): Unregister
  onSave(receive: ChangeListener<T,  T | null>): Unregister

  readonly [privateKey]: ModelStoreInternals<T>
}

interface ModelStoreInternals<T> extends StoreInternals<ModelStoreState<T>> {
  parse: (record: T) => T
}

interface ModelSaveOptions {
  index?: number
}

interface CreateStoreActions<T, S> {
  (state: T, update: UpdateTrigger): S
}

interface UpdateTrigger {
  (applyUpdate: () => void | boolean): void
}

export interface ModelStoreState<T> {
  list: T[]
  mapping: ModelStoreMapping<T>
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

interface GlobalState {
  isUpdating: boolean
  delayedNotifications: Set<StoreInternals<unknown>>
}

const globalState: GlobalState = {
  isUpdating: false,
  delayedNotifications: new Set(),
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
    id: 0,
  }
  const update: UpdateTrigger =  (applyUpdate: () => void) => runUpdate(applyUpdate, internals)
  return {
    ...actions(internals.state, update),
    [privateKey]: internals,
  }
}

const runUpdate = <S>(applyUpdate: () => void | boolean, internals: StoreInternals<S>) => {
  if (globalState.isUpdating) {
    applyUpdate()
    return
  }
  globalState.isUpdating = true
  if (applyUpdate() === false) {
    return
  }
  globalState.delayedNotifications.add(internals)
  for (const storeToNotify of globalState.delayedNotifications) {
    storeToNotify.listeners.forEach((listen) => {
      listen()
    })
    storeToNotify.id += 1
  }
  globalState.delayedNotifications.clear()
  globalState.isUpdating = false
  runAfterUpdateCallbacks()
}

/**
 * `afterUpdateCallbacks` contains callbacks that are executed right after `runPatch`.
 * They are only executed once, and then removed from the array.
 *
 * `afterUpdateCallbacks` is `null` if no patch is currently running.
 */
const afterUpdateCallbacks = new Set<() => void>()

/**
 * Run a callback after the current store patch has finished.
 * If no patch is currently running, the callback is executed immediately.
 * @param callback The callback to execute.
 */
export const afterUpdate = (callback: () => void): void => {
  if (globalState.isUpdating) {
    afterUpdateCallbacks.add(callback)
  } else {
    callback()
  }
}

/**
 * Run all callbacks in `afterUpdateCallbacks` and reset it to its default value.
 */
const runAfterUpdateCallbacks = () => {
  for (const callback of afterUpdateCallbacks) {
    callback()
  }
  afterUpdateCallbacks.clear()
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
      afterUpdate(() => updateListeners.forEach((listen) => listen(record, oldRecord)))
    } else {
      afterUpdate(() => createListeners.forEach((listen) => listen(record)))
    }
    const i = index ?? getStoreIndexOf(state.list, record)
    state.list.splice(i, 0, record)
    return true
  }

  const store = createStore(initialState, (state, update) => ({
    ...((actions === undefined ? {} : actions) as S),
    list(ids?: Id<T>[]): readonly T[] {
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
      return state.mapping[id] ?? null
    },
    save: (record: T, options: ModelSaveOptions = {}): void => update(() => (
      save(state, record, options.index)
    )),
    saveAll: (records: Iterable<T>): void => update(() => {
      let changeCount = 0
      for (const record of records) {
        changeCount += save(state, record) ? 1 : 0
      }
      return changeCount > 0
    }),
    remove: (id: Id<T>): void => update(() => {
      const record = state.mapping[id]
      if (record === undefined) {
        return false
      }
      state.list.splice(state.list.indexOf(record), 1)
      delete state.mapping[id]
      afterUpdate(() => removeListeners.forEach((listen) => listen(record)))
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
