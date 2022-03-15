import Id from '@/models/base/Id'
import { applyPatch, Patch, Patcher } from '@/utils/update'
import Model from '@/models/base/Model'

export const privateKey = Symbol('store/private')

export interface Store<T> {
  readonly [privateKey]: StoreInternals<T>
}

export interface ModelStore<T> extends Store<ModelStoreState<T>> {
  list(ids?: Id<T>[]): readonly T[]
  find(id: Id<T>): T | null
  save(record: T): void
  saveAll(records: Iterable<T>): void
  remove(id: Id<T>): void

  onCreate(receive: RecordListener<T>): Unregister
  onUpdate(receive: ChangeListener<T>): Unregister
  onRemove(receive: RecordListener<T>): Unregister
  onSave(receive: ChangeListener<T,  T |null>): Unregister

  readonly [privateKey]: ModelStoreInternals<T>
}

interface CreateStoreActions<T, S> {
  (getState: () => T, setState: Patcher<T>): S
}

export interface ModelStoreState<T> {
  list: readonly T[]
  mapping: Readonly<ModelStoreMapping<T>>
}

type ModelStoreMapping<T> = Record<Id<T>, T>

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
export function createModelStore<T extends Model, S>(parseRecord: (value: T) => T, actions?: S): ModelStore<T> & S {
  const initialState: ModelStoreState<T> = {
    list: [],
    mapping: {},
  }

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
   * Saves a record into a mutable state.
   * @param state The state to insert into.
   * @param record The record to save.
   */
  const save = (state: { list: T[], mapping: ModelStoreMapping<T> }, record: T) => {
    const oldRecord = state.mapping[record.id] ?? null
    state.mapping[record.id] = record
    if (oldRecord === null) {
      state.list.push(record)
      updateListeners.forEach((listen) => listen(record, oldRecord))
    } else {
      const i = state.list.indexOf(oldRecord)
      state.list[i] = record
      createListeners.forEach((listen) => listen(record))
    }
  }

  const store = createStore(initialState, (getState, setState) => ({
    ...((actions === undefined ? {} : actions) as S),
    list(ids?: Id<T>[]): readonly T[] {
      const state = getState()
      if (ids === undefined) {
        return state.list
      }
      const result = Array(ids.length)
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i]
        const record = state.mapping[id]
        if (record === undefined) {
          throw new Error(`id not found in store: ${id}`)
        }
        result.splice(i, 0, record)
      }
      return result
    },
    find(id: Id<T>): T | null {
      const { mapping } = getState()
      return mapping[id] ?? null
    },
    save: (record: T): void => setState((state) => {
      const newState = {
        list: [...state.list],
        mapping: { ...state.mapping },
      }
      save(newState, record)
      return newState
    }),
    saveAll: (records: Iterable<T>): void => setState((state) => {
      const newState = {
        list: [...state.list],
        mapping: { ...state.mapping },
      }
      for (const record of records) {
        save(newState, record)
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
      removeListeners.forEach((listen) => listen(record))
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
  ;(store as any)[privateKey] = {
    ...store[privateKey],
    parse: parseRecord,
  }
  return store
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

  // Set `delayedPatches` to an empty array to signal that a patch is now being executed.
  delayedPatches = []

  // Backup the current state, so we can compare to it after applying the patch.
  const oldState = internals.state

  // Apply the patch to the current state and store the result.
  internals.state = applyPatch(internals.state, patch)

  // Run any delayed patches and reset the global patch state.
  runDelayedPatches()

  // Broadcast the change to the listeners, if anything has changed at all.
  if (oldState !== internals.state) {
    internals.listeners.forEach((listener) => listener(internals.state))
  }

}

/**
 * Run any delayed patches and reset the global patch state.
 */
const runDelayedPatches = () => {
  while (delayedPatches !== null && delayedPatches.length !== 0) {
    // Get all delayed patches and reset the global patch buffer.
    const patches = delayedPatches
    delayedPatches = []

    // Apply the delayed patches.
    // If these patches trigger other patches, they will get executed in the next while iteration.
    for (const [internals, patch] of patches) {
      internals.state = applyPatch(internals.state, patch)
    }
  }
  delayedPatches = null
}
