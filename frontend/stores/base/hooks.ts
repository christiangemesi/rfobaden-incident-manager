import Id, { isId } from '@/models/base/Id'
import Model from '@/models/base/Model'
import { ModelStore, privateKey, Store } from '@/stores/base/Store'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useEffectOnce, useUpdate } from 'react-use'

export const useStore = <T>(store: Store<T>): T => {
  const internals = store[privateKey]
  const forceUpdate = useUpdate()
  const { id } = internals
  useEffect(() => {
    const updateStore = () => {
      forceUpdate()
    }
    internals.listeners.push(updateStore)
    if (internals.id !== id) {
      updateStore()
    }
    return () => {
      internals.listeners.splice(internals.listeners.indexOf(updateStore), 1)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store])
  return internals.state
}

interface UseRecords<T> {
  (): readonly T[]
}

interface UseRecord<T> {
  (id: Id<T> | null): T | null
  (record: T): T
}

export const createUseRecords = <T>(store: ModelStore<T>): UseRecords<T> => {
  let records = store.list()
  const updaters = new Map<() => void, boolean>()

  const internals = store[privateKey]
  internals.listeners.push(() => {
    // TODO check if this map is of any use
    for (const updater of updaters.keys()) {
      updaters.set(updater, false)
    }
    records = store.list()
    for (const [updater, hasUpdated] of updaters.entries()) {
      if (!hasUpdated) {
        updater()
      }
    }
  })

  return () => {
    const forceUpdate = useUpdate()
    updaters.set(forceUpdate, true)
    useEffectOnce(() => {
      return () => {
        updaters.delete(forceUpdate)
      }
    })
    return records
  }
}

export const createUseRecord = <T extends Model>(store: ModelStore<T>): UseRecord<T> => {
  return (recordOrId) => {
    const isIdHook = recordOrId === null || isId(recordOrId)
    const useResult = useMemo(() => (isIdHook
      ? createUseRecordByValue(store)
      : createUseRecordById(store)
    ), [isIdHook])
    return useResult(recordOrId as never) as T
  }
}

const createUseRecordByValue = <T extends Model>(store: ModelStore<T>) => {
  const internals = store[privateKey]
  return (data: T): T => {
    const [record, setRecord] = useState(() => internals.parse(data))
    useEffect(() => {
      store.save(internals.parse(data))
    }, [data])
    useEffectOnce(() => {
      const updateRecord = () => {
        const newRecord = store.find(data.id)
        if (newRecord !== null) {
          setRecord(newRecord)
        }
      }
      internals.listeners.push(updateRecord)
      return () =>{
        internals.listeners.splice(internals.listeners.indexOf(updateRecord), 1)
      }
    })
    return record
  }
}

const createUseRecordById = <T>(store: ModelStore<T>) => {
  const internals = store[privateKey]
  return (id: Id<T> | null): T | null => {
    const [record, setRecord] = useState(() => id === null ? null : store.find(id))
    const ref = useRef(record)
    ref.current = record
    useEffect(() => {
      if (id === null) {
        if (ref.current !== null) {
          setRecord(null)
        }
        return
      }
      const updateRecord = () => {
        const newRecord = store.find(id)
        if (newRecord !== ref.current) {
          setRecord(newRecord)
        }
      }
      internals.listeners.push(updateRecord)
      return () =>{
        internals.listeners.splice(internals.listeners.indexOf(updateRecord), 1)
      }
    }, [id])
    return record
  }
}
