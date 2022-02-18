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
  (ids?: Id<T>[]): T[]
  <O>(transform: (records: T[]) => O, deps?: unknown[]): O
}

const createUseRecords = <T extends Model>(store: ModelStore<T>): UseRecords<T> => (
  <O>(idsOrTransform?: Id<T>[] | ((records: T[]) => O), depsOrUndefined?: unknown[]) => {
    const { compare } = store[privateKey]
    const useAction = useMemo(() => {
      if (idsOrTransform === undefined) {
        return (): T[] => {
          const { records } = useStore(store)
          if (compare === undefined) {
            return useMemo(() => Object.values(records), [records])
          }
          return useMemo(() => Object.values(records).sort(compare), [records])
        }
      }
      if (Array.isArray(idsOrTransform)) {
        const ids: Id<T>[] = idsOrTransform
        return (): T[] => {
          const { records } = useStore(store)
          // eslint-disable-next-line react-hooks/exhaustive-deps
          return useMemo(() => store.list(ids), [records])
        }
      }

      const transform: ((records: T[]) => O) = idsOrTransform
      return (): O => {
        const { records } = useStore(store)
        if (compare === undefined) {
          return useMemo(() => (
            transform(Object.values(records))
          // eslint-disable-next-line react-hooks/exhaustive-deps
          ), [records, ...(depsOrUndefined ?? [])])
        }
        return useMemo(() => (
          transform(Object.values(records).sort(compare))
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ), [records, ...(depsOrUndefined ?? [])])
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
        const { records } = useStore(store)
        if (id === null) {
          return null as unknown as T
        }
        return records[id] ?? null as unknown as T
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

      const { records: { [record.id]: storedRecord }} = useStore(store)
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
    records: {},
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
      list(ids?: Id<T>[]): T[] {
        const { records } = getState()
        if (ids === undefined) {
          const result = Object.values(records)
          if (compare === undefined) {
            return result
          }
          return result.sort(compare)
        }

        const result = [] as T[]
        for (const id of ids) {
          result.push(records[id])
        }
        if (compare === undefined) {
          return result
        }
        return result.sort(compare)
      },
      find(id: Id<T>): T | null {
        const { records } = getState()
        return records[id] ?? null
      },
      save(record: T) {
        const oldRecord = getState().records[record.id] as T | undefined
        setState((state) => ({
          records: {
            ...state.records,
            [record.id]: record,
          },
        }))
        if (oldRecord === undefined) {
          createListeners.forEach((receive) => receive(record))
        } else {
          updateListeners.forEach((receive) => receive(record, oldRecord))
        }
      },
      saveAll(records: Iterable<T>) {
        const newRecords: ModelStoreState<T>['records'] = {}
        const newAndOld: Array<[T, T | undefined]> = []
        for (const record of records) {
          newRecords[record.id] = record
          newAndOld.push([record, getState().records[record.id]])
        }
        setState((state) => ({
          records: {
            ...state.records,
            ...newRecords,
          },
        }))
        for (const [record, oldRecord] of newAndOld) {
          if (oldRecord === undefined) {
            createListeners.forEach((receive) => receive(record))
          } else {
            updateListeners.forEach((receive) => receive(record, oldRecord))
          }
        }
      },
      remove(id: Id<T>) {
        const record = getState().records[id] as T | undefined
        setState((state) => {
          const records = { ...state.records }
          delete records[id]
          return {
            records,
          }
        })
        if (record !== undefined) {
          removeListeners.forEach((receive) => receive(record))
        }
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

  store[privateKey].compare = compare

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
  list(ids?: Id<T>[]): T[]
  find(id: Id<T>): T | null
  save(record: T): void
  saveAll(records: Iterable<T>): void
  remove(id: Id<T>): void

  onCreate(receive: (record: T) => void): () => void;
  onUpdate(receive: (record: T, oldRecord: T) => void): () => void;
  onRemove(receive: (record: T) => void): () => void;
  onSave(receive: (record: T, oldRecord: T | null) => void): () => void;

  readonly [privateKey]: ModelStoreInternals<T>
}

interface ModelStoreInternals<T> extends StoreInternals<ModelStoreState<T>> {
  parseRecord: (record: T) => T,
  compare?: (a: T, b: T) => number,
}


interface CreateActions<T, S> {
  (getState: () => T, setState: Patcher<T>): S
}


interface ModelStoreState<T> {
  records: Record<Id<T>, T>
}

interface ModelStoreOptions<T> {
  sortBy?: (record: T) => ['asc' | 'desc', (unknown | [unknown, 'asc' | 'desc'])[]],
}
