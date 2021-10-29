import { Dispatch, useEffect, useState } from 'react'
import { useEffectOnce, useIsomorphicLayoutEffect } from 'react-use'
import Model from '@/models/base/Model'
import Id from '@/models/base/Id'

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

const createUseRecords = <T>(store: ModelStore<T>) => (): T[] => {
  const [records, setRecords] = useState([] as T[])
  const state = useStore(store)
  useEffect(() => {
    setRecords(Object.values(state.records))
  }, [state])
  return records
}

const createUseRecord = <T>(store: ModelStore<T>) => (id: Id<T>): T | null => {
  const { records } = useStore(store)
  return records[id] ?? null
}

export const createStore = <T, S>(initialState: T, actions: CreateActions<T, S>): Store<T> & S => {
  let state = initialState
  const setters = [] as Array<(value: T) => void>
  const setState: SetState<T> = (update): void => {
    state = typeof update === 'function' ? (update as (state: T) => T)(state) : update
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
): [ModelStore<T> & S, () => T[], (id: Id<T>) => T | null] => {
  const initialState: ModelStoreState<T> = {
    records: {},
  }
  const store = createStore(initialState, (getState, setState) => {
    return {
      ...actions,
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
  save(record: T): void
  saveAll(records: Iterable<T>): void
  remove(id: Id<T>): void
}

type SetState<T> = Dispatch<T | ((value: T) => T)>

interface CreateActions<T, S> {
  (getState: () => T, setState: SetState<T>): S
}

interface ModelStoreState<T> {
  records: Record<Id<T>, T>
}
