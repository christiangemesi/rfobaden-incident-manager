import { useCallback, useEffect } from 'react'
import { useStatic } from '@/utils/hooks/useStatic'
import { useGetSet } from 'react-use'
import { run } from '@/utils/control-flow'

const useSort = <T, K extends string>(elements: readonly T[], config: () => SortConfig<T, K>): [readonly T[], SortState<K>] => {
  const comparesByKeys: Record<K, Compare<T>> = useStatic(() => {
    const keys = {} as Record<K, Compare<T>>
    const configByKeys = config()
    for (const key of Object.keys(configByKeys)) {
      const value = configByKeys[key]
      keys[key] = run(() => {
        if (value === String) {
          const stringKey = key as unknown as keyof T
          return (a: T, b: T) => (a[stringKey] as unknown as string).localeCompare((b[stringKey]) as unknown as string)
        }
        if (typeof value === 'function') {
          return value as Compare<T>
        }
        throw new Error(`unknown sort config for '${key}': ${value}`)
      })
    }
    return keys
  })

  const [getElements, setElements] = useGetSet(elements)

  const sort = useCallback((unsorted: readonly T[], state: SortState<K>): readonly T[] => {
    const sorted = [...unsorted]
    let sortCounter = 0
    console.log()
    for (const key of Object.keys(state).reverse()) {
      const direction = state[key].direction
      if (direction === null) {
        continue
      }
      console.log(key, direction)
      sortCounter += 1
      const compareAsc = comparesByKeys[key]
      const compare: Compare<T> = direction === 'asc'
        ? compareAsc
        : (a, b) => compareAsc(b, a)
      sorted.sort(compare)
    }
    return sortCounter === 0 ? getElements() : sorted
  }, [comparesByKeys, getElements])
  
  const [get, set] = useGetSet<[readonly T[], SortState<K>]>(() => {
    const state = Object.keys(comparesByKeys).reduce((state, key) => {
      state[key] = {
        direction: null,
        setDirection(direction) {
          set(([elements, state]) => {
            const newState = { ...state }
            const keyState = newState[key]
            delete newState[key]
            newState[key] = { ...keyState, direction }
            const sorted = sort(elements, newState)
            return [sorted, newState]
          })
        },
      }
      return state
    }, {} as SortState<K>)
    return [elements, state]
  })

  useEffect(() => {
    setElements(elements)
    const [_, state] = get()
    const sorted = sort(elements, state)
    set([sorted, state])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements])
  
  return get()
}
export default useSort

export type SortDirection = 'asc' | 'desc' | null

type SortConfig<T, Ks extends string | keyof T> = {
  [K in Ks]:
    K extends keyof T
      ? T[K] extends string ? (typeof String | Compare<T>)
      : T[K] extends number ? (typeof Number | Compare<T>)
      : Compare<T>
      : Compare<T>
}

interface Compare<T> {
  (a: T, b: T): number
}

type SortState<Ks extends string> = {
  [K in Ks]: SortField
}

export interface SortField {
  direction: SortDirection,
  setDirection(direction: SortDirection): void
}
