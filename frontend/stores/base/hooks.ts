import { useState } from 'react'
import { useIsomorphicLayoutEffect } from 'react-use'
import { ModelStore, ModelStoreState, privateKey, Store } from './Store'
import Id, { isId } from '@/models/base/Id'
import Model from '@/models/base/Model'

interface UseRecord<T> {
  (id: Id<T> | null): T | null
  (record: T): T
}

interface UseRecords<T> {
  (ids?: Id<T>[]): readonly T[]
  <O>(transform: (records: readonly T[]) => O, deps?: unknown[]): O
}

const useStore = <T>(store: Store<T>): T => {
  const inner = store[privateKey]
  const [storeState, setStoreState] = useState(inner.state)
  useStoreListener(store, setStoreState)
  return storeState
}

const createUseRecord = <T extends Model>(store: ModelStore<T>): UseRecord<T> => {
  const computeValue = (state: ModelStoreState<T>, oldValue: T | null, idOrRecord: Id<T> | T | null): T | null => {
    if (idOrRecord === null) {
      return null
    }
    if (isId(idOrRecord)) {
      console.log(idOrRecord, state.mapping)
      return state.mapping[idOrRecord] ?? null
    }
    return state.mapping[idOrRecord.id] ?? oldValue ?? null
  }
  return (idOrRecord: Id<T> | T | null) => {
    const [result, setResult] = useState(() => {
      if (idOrRecord !== null && !isId(idOrRecord)) {
        const record = store[privateKey].parse(idOrRecord)
        store.save(record)
        return record
      }
      return computeValue(store[privateKey].state, null, idOrRecord)
    })
    useStoreListener(store, (state) => {
      console.log(store[privateKey].parse, state, idOrRecord)
      setResult(computeValue(state, result, idOrRecord))
    }, [idOrRecord])
    return result as T
  }
}

const createUseRecords = <T>(store: ModelStore<T>): UseRecords<T> => {
  const computeValue = <O>(state: ModelStoreState<T>, idsOrTransform?: Id<T>[] | ((records: readonly T[]) => O)): readonly T[] | O | null => {
    if (idsOrTransform === undefined) {
      return state.list
    }
    if (Array.isArray(idsOrTransform)) {
      return store.list(idsOrTransform)
    }
    return idsOrTransform(state.list)
  }
  return <O>(idsOrTransform?: Id<T>[] | ((records: readonly T[]) => O), deps: unknown[] = []) => {
    const [result, setResult] = useState(() => computeValue(store[privateKey].state, idsOrTransform))
    useStoreListener(store, (state) => {
      setResult(computeValue(state, idsOrTransform))
    }, [typeof idsOrTransform === 'function' ? null : idsOrTransform, ...deps])
    return result
  }
}

const useStoreListener = <T>(store: Store<T>, listen: (value: T) => void, deps?: unknown[]) => {
  const inner = store[privateKey]
  useIsomorphicLayoutEffect(() => {
    inner.listeners.push(listen)
    return () => {
      const i = inner.listeners.indexOf(listen)
      inner.listeners.splice(i, 1)
    }
  })

  // Conditional hook call - this is kind of really dangerous, but the cleanest way to solve this issue by far.
  // Keep it this way for now, and hope that no one gets the idea to swap a deps array between undefined and array.
  if (deps !== undefined) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useIsomorphicLayoutEffect(() => {
      listen(inner.state)
    }, deps)
  }
}

export {
  useStore,
  createUseRecord,
  createUseRecords,
}