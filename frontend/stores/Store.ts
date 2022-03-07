import { useMemo, useState } from 'react'
import { useEffectOnce, useIsomorphicLayoutEffect, useUpdateEffect } from 'react-use'
import Model from '@/models/base/Model'
import Id, { isId } from '@/models/base/Id'
import { Patcher, PatchFn } from '@/utils/update'
import { run } from '@/utils/control-flow'

export const useStore = <T>(store: Store<T>): T => {
  const inner = store[privateKey]
  const [globalState, setGlobalState] = useState(inner.state)
  useEffectOnce(() => () => {
    const i = inner.setters.indexOf(setGlobalState)
    if (i !== -1) {
      inner.setters.splice(i, 1)
    }
  })
  useIsomorphicLayoutEffect(() => {
    if (!inner.setters.includes(setGlobalState)) {
      inner.setters.push(setGlobalState)
    }
  })
  return globalState
}

interface UseRecords<T> {
  (ids?: Id<T>[]): readonly T[]
  <O>(transform: (records: readonly T[]) => O, deps?: unknown[]): O
}

const createUseRecords = <T extends Model>(store: ModelStore<T>): UseRecords<T> => (
  <O>(idsOrTransform?: Id<T>[] | ((records: readonly T[]) => O), depsOrUndefined?: unknown[]) => {
    const useAction = useMemo(() => {
      if (idsOrTransform === undefined) {
        return (): readonly T[] => {
          return useStore(store).recordList
        }
      }
      if (Array.isArray(idsOrTransform)) {
        const ids: Id<T>[] = idsOrTransform
        return (): readonly T[] => {
          const { recordMapping } = useStore(store)
          // eslint-disable-next-line react-hooks/exhaustive-deps
          return useMemo(() => store.list(ids), [recordMapping])
        }
      }

      const transform: ((records: readonly T[]) => O) = idsOrTransform
      return (): O => {
        const { recordList } = useStore(store)
        return useMemo(() => (
          transform(recordList)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ), [recordList, ...(depsOrUndefined ?? [])])
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depsOrUndefined, idsOrTransform])
    return useAction()
  }
)


interface UseRecord<T> {
  (id: Id<T> | null): T | null
  (record: T): T
}

const createUseRecord = <T extends Model>(store: ModelStore<T>): UseRecord<T> => (idOrRecord) => {
  const useAction = useMemo(() => {
    if (idOrRecord === null || isId(idOrRecord)) {
      const id: Id<T> | null = idOrRecord
      return (): T => {
        const { recordMapping } = useStore(store)
        if (id === null) {
          return null as unknown as T
        }
        return recordMapping[id] ?? null as unknown as T
      }
    }
    return (): T => {
      const [record, setRecord] = useState<T>(() => {
        const { parseRecord } = store[privateKey]
        return parseRecord(idOrRecord)
      })
      useEffectOnce(() => {
        store.save(record)
      })

      const { recordMapping: { [record.id]: storedRecord }} = useStore(store)
      useUpdateEffect(() => {
        setRecord(storedRecord)
      }, [storedRecord ?? record])
      return record as T
    }
  }, [idOrRecord])
  return useAction()
}

export const createStore = <T, S>(initialState: T, actions: CreateActions<T, S>): Store<T> & S => {
  let state = initialState
  const setters = [] as Array<(value: T) => void>
  const setState: Patcher<T> = (patch) => {
    const partialState = typeof patch === 'function' ? (patch as PatchFn<T>)(state) : patch
    state = {
      ...state,
      ...partialState,
    }
    setters.forEach((set) => set(state))
  }

  const store: Store<T> & S = {
    ...actions(() => state, setState),
    [privateKey]: {
      get state(): T {
        return state
      },
      get setters() {
        return setters
      },
    },
  }
  return store
}

type ModelStoreParts<T extends Model, S = unknown> =
  [ModelStore<T> & S, UseRecords<T>, UseRecord<T>]

export function createModelStore<T extends Model>(parseRecord: (value: T) => T): ModelStoreParts<T>
export function createModelStore<T extends Model, S>(parseRecord: (value: T) => T, actions: S, options: ModelStoreOptions<T>): ModelStoreParts<T, S>
export function createModelStore<T extends Model, S>(
  parseRecord: (value: T) => T,
  actions?: S,
  options?: ModelStoreOptions<T>,
): ModelStoreParts<T,  S> {
  const initialState: ModelStoreState<T> = {
    recordList: [],
    recordMapping: {},
  }

  const sortBy = options?.sortBy
  const factorOf = (order: 'asc' | 'desc') => order === 'asc' ? 1 : -1
  const compare = sortBy == undefined ? undefined : (recordA: T, recordB: T): number => {
    const [order, as] = sortBy(recordA)
    const [_order, bs] = sortBy(recordB)

    for (let i = 0; i < as.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const valueA = as[i] as any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const valueB = bs[i] as any

      const [a, b, factor] = Array.isArray(valueA) && valueA.length === 2
        ? [valueA[0], valueB[0], factorOf(valueA[1])]
        : [valueA, valueB, factorOf(order)]

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
   * Stores a new record into the stores' list.
   * The insertion happens in place, so the stores' list has to be copied outside this function to
   * ensure that the existing store does not get mutated.
   *
   * @param records The list of currently stored records.
   * @param newRecord The record to be stored.
   * @param oldRecord The records' old entry, if it exists. Will be removed.
   * @param index The index at which the record should be inserted. If left `undefined`, a fitting position will be determined
   *              using the stores' sort configuration.
   */
  const storeRecordIntoList = (records: T[], newRecord: T, oldRecord: T | undefined, index?: number) => {
    if (oldRecord !== undefined) {
      records.splice(records.indexOf(oldRecord), 1)
    }
    const storeIndex = index ?? getStoreIndexOf(records, newRecord)
    records.splice(storeIndex, 0, newRecord)
  }

  const store = createStore<ModelStoreState<T>, ModelStore<T> & S>(initialState, (getState, setState) => {
    const createListeners: Array<(record: T) => void> = []
    const updateListeners: Array<(newRecord: T, oldRecord: T) => void> = []
    const removeListeners: Array<(record: T) => void> = []

    const insertListener = <F>(listeners: F[], listener: F): () => void => {
      const i = listeners.length - 1
      listeners.push(listener)
      return () => {
        listeners.splice(i, 1)
      }
    }

    return {
      ...(actions ?? {} as S),
      list(ids?: Id<T>[]): readonly T[] {
        const state = getState()
        if (ids === undefined) {
          return state.recordList
        }
        const result = Array(ids.length)
        for (let i = 0; i < ids.length; i++) {
          const id = ids[i]
          const record = state.recordMapping[id]
          if (record === undefined) {
            throw new Error(`id not found in store: ${id}`)
          }
          result.splice(i, 0, record)
        }
        return result
      },
      find(id: Id<T>): T | null {
        const { recordMapping } = getState()
        return recordMapping[id] ?? null
      },
      save(newRecord: T, options = {}) {
        const oldRecord = getState().recordMapping[newRecord.id] as T | undefined
        setState((state) => {
          const recordList = [...state.recordList]
          storeRecordIntoList(recordList, newRecord, oldRecord, options.index)
          return {
            recordList,
            recordMapping: {
              ...state.recordMapping,
              [newRecord.id]: newRecord,
            },
          }
        })
        if (oldRecord === undefined) {
          createListeners.forEach((receive) => receive(newRecord))
        } else {
          updateListeners.forEach((receive) => receive(newRecord, oldRecord))
        }
      },
      saveAll(newRecords: Iterable<T>) {
        const newRecordMapping: Record<Id<T>, T> = {}
        const newAndOld: Array<[T, T | undefined]> = []
        setState((state) => {
          const recordList = [...state.recordList]
          for (const newRecord of newRecords) {
            const oldRecord = getState().recordMapping[newRecord.id]
            newRecordMapping[newRecord.id] = newRecord
            newAndOld.push([newRecord, oldRecord])
            storeRecordIntoList(recordList, newRecord, oldRecord)
          }
          return {
            recordList: Object.freeze(recordList),
            recordMapping: Object.freeze({
              ...state.recordMapping,
              ...newRecordMapping,
            }),
          }
        })
        for (const [record, oldRecord] of newAndOld) {
          if (oldRecord === undefined) {
            createListeners.forEach((receive) => receive(record))
          } else {
            updateListeners.forEach((receive) => receive(record, oldRecord))
          }
        }
      },
      remove(id: Id<T>) {
        const record = getState().recordMapping[id] as T | undefined
        if (record === undefined) {
          return
        }
        setState((state) => {
          const recordList = [...state.recordList]
          recordList.splice(recordList.indexOf(record), 1)
          const recordMapping = { ...state.recordMapping }
          delete recordMapping[id]
          return {
            recordList: Object.freeze(recordList),
            recordMapping: Object.freeze(recordMapping),
          }
        })
        removeListeners.forEach((receive) => receive(record))
      },

      onCreate(receive: (record: T) => void): () => void {
        return insertListener(createListeners, receive)
      },
      onUpdate(receive: (record: T, oldRecord: T) => void): () => void {
        return insertListener(updateListeners, receive)
      },
      onRemove(receive: (record: T) => void): () => void {
        return insertListener(removeListeners, receive)
      },
      onSave(receive: (record: T, oldRecord: T | null) => void): () => void {
        const removeCreate = insertListener(createListeners, (record) => receive(record, null))
        const removeUpdate = insertListener(updateListeners, receive)
        return () => {
          removeCreate()
          removeUpdate()
        }
      },

      // Will be overwritten by `createStore`, but required here to satisfy the type checker.
      [privateKey]: undefined as unknown as ModelStoreInternals<T>,
    }
  })

  // Assign the internal `parseRecord` property separately,
  // since the normal store does not know it.
  store[privateKey].parseRecord = parseRecord

  return [
    store,
    createUseRecords(store),
    createUseRecord(store),
  ]
}

const privateKey = Symbol('Store.private')

interface Store<T> {
  readonly [privateKey]: StoreInternals<T>
}

interface StoreInternals<T> {
  state: T
  setters: Array<(value: T) => void>
}

interface ModelStore<T> extends Store<ModelStoreState<T>> {
  list(ids?: Id<T>[]): readonly T[]
  find(id: Id<T>): T | null
  save(record: T, options?: ModelSaveOptions): void
  saveAll(records: Iterable<T>): void
  remove(id: Id<T>): void

  onCreate(receive: (record: T) => void): () => void;
  onUpdate(receive: (record: T, oldRecord: T) => void): () => void;
  onRemove(receive: (record: T) => void): () => void;
  onSave(receive: (record: T, oldRecord: T | null) => void): () => void;

  readonly [privateKey]: ModelStoreInternals<T>
}

interface ModelSaveOptions {
  index?: number
}

interface ModelStoreInternals<T> extends StoreInternals<ModelStoreState<T>> {
  parseRecord: (record: T) => T
}


interface CreateActions<T, S> {
  (getState: () => T, setState: Patcher<T>): S
}


interface ModelStoreState<T> {
  recordList: readonly T[]
  recordMapping: Readonly<Record<Id<T>, T>>
}

interface ModelStoreOptions<T> {
  sortBy?: (record: T) => ['asc' | 'desc', (unknown | [unknown, 'asc' | 'desc'])[]],
}
