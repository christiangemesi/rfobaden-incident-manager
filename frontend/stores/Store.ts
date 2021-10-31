import { useEffect, useMemo, useState } from 'react'
import { useEffectOnce, useIsomorphicLayoutEffect } from 'react-use'
import Model from '@/models/base/Model'
import Id from '@/models/base/Id'
import { PartialUpdate, PartialUpdateFn } from '@/utils/update'

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
}

const createUseRecords = <T extends Model>(store: ModelStore<T>): UseRecords<T> => (ids) => {
  const [records, setRecords] = useState([] as T[])
  const state = useStore(store)
  const idSet = useMemo(() => ids === undefined ? null : new Set(ids), [ids])
  useEffect(() => {
    let records = Object.values(state.records)
    if (idSet !== null) {
      records = records.filter(({ id }) => idSet.has(id))
    }
    setRecords(records)
  }, [state, idSet])
  return records
}

const createUseRecord = <T>(store: ModelStore<T>) => (id: Id<T>): T | null => {
  const { records } = useStore(store)
  return records[id] ?? null
}

export const createStore = <T, S>(initialState: T, actions: CreateActions<T, S>): Store<T> & S => {
  let state = initialState
  const setters = [] as Array<(value: T) => void>
  const setState: PartialUpdate<T> = (update) => {
    const partialState = typeof update === 'function' ? (update as PartialUpdateFn<T>)(state) : update
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

export const createModelStore = <T extends Model>() => <S>(
  actions: S,
): [ModelStore<T> & S, UseRecords<T>, (id: Id<T>) => T | null] => {
  const initialState: ModelStoreState<T> = {
    records: {},
  }
  const store = createStore<ModelStoreState<T>, ModelStore<T> & S>(initialState, (getState, setState) => {
    return {
      ...actions,
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
      [privateKey]: undefined as unknown as Store<ModelStoreState<T>>[typeof privateKey],
    }
  })

  return [
    store,
    createUseRecords(store),
    createUseRecord(store),
  ]
}

const privateKey = Symbol('Store.private')

interface Store<T> {
  readonly [privateKey]: {
    state: T
    setters: Array<(value: T) => void>
  }
}

interface ModelStore<T> extends Store<ModelStoreState<T>> {
  list(ids?: Id<T>[]): T[]
  find(id: Id<T>): T | null
  save(record: T): void
  saveAll(records: Iterable<T>): void
  remove(id: Id<T>): void
}


interface CreateActions<T, S> {
  (getState: () => T, setState: PartialUpdate<T>): S
}


interface ModelStoreState<T> {
  records: Record<Id<T>, T>
}
