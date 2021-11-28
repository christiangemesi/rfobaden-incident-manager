import { useMemo, useState } from 'react'
import { useEffectOnce, useIsomorphicLayoutEffect, useUpdateEffect } from 'react-use'
import Model from '@/models/base/Model'
import Id, { isId } from '@/models/base/Id'
import { Patcher, PatchFn } from '@/utils/update'

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
  <O>(transform: (records: T[]) => O): O
}

const createUseRecords = <T extends Model>(store: ModelStore<T>): UseRecords<T> => (
  <O>(idsOrTransform?: Id<T>[] | ((records: T[]) => O)) => {
    const useAction = useMemo(() => {
      if (idsOrTransform === undefined) {
        return (): T[] => {
          const { records } = useStore(store)
          return useMemo(() => Object.values(records), [records])
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
        return useMemo(() => transform(Object.values(records)), [records])
      }
    }, [idsOrTransform])
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
export function createModelStore<T extends Model, S>(parseRecord: (value: T) => T, actions: S): ModelStoreParts<T, S>
export function createModelStore<T extends Model, S>(
  parseRecord: (value: T) => T,
  actions?: S,
): ModelStoreParts<T,  S> {
  const initialState: ModelStoreState<T> = {
    records: {},
  }
  const store = createStore<ModelStoreState<T>, ModelStore<T> & S>(initialState, (getState, setState) => {
    return {
      ...(actions ?? {} as S),
      list(ids?: Id<T>[]): T[] {
        const { records } = getState()
        if (ids === undefined) {
          return Object.values(records)
        }
        const result = [] as T[]
        for (const id of ids) {
          result.push(records[id])
        }
        return result
      },
      find(id: Id<T>): T | null {
        const { records } = getState()
        return records[id] ?? null
      },
      save(record: T) {
        setState((state) => ({
          records: {
            ...state.records,
            [record.id]: record,
          },
        }))
      },
      saveAll(records: Iterable<T>) {
        const newRecords: ModelStoreState<T>['records'] = {}
        for (const record of records) {
          newRecords[record.id] = record
        }
        setState((state) => ({
          records: {
            ...state.records,
            ...newRecords,
          },
        }))
      },
      remove(id: Id<T>) {
        setState((state) => {
          const records = { ...state.records }
          delete records[id]
          return {
            records,
          }
        })
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
  list(ids?: Id<T>[]): T[]
  find(id: Id<T>): T | null
  save(record: T): void
  saveAll(records: Iterable<T>): void
  remove(id: Id<T>): void

  readonly [privateKey]: ModelStoreInternals<T>
}

interface ModelStoreInternals<T> extends StoreInternals<ModelStoreState<T>> {
  parseRecord: (record: T) => T
}


interface CreateActions<T, S> {
  (getState: () => T, setState: Patcher<T>): S
}


interface ModelStoreState<T> {
  records: Record<Id<T>, T>
}
