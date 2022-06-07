import { useCallback, useEffect } from 'react'
import { useStatic } from '@/utils/hooks/useStatic'
import { useGetSet } from 'react-use'
import { run } from '@/utils/control-flow'

/**
 * `useSort` is a React hook that sorts a list of elements.
 *
 * @param elements The elements to sort.
 * @param config The sort config.
 * @return The sorted list, and a {@link SortState} which can change the sort order.
 */
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
    for (const key of Object.keys(state).reverse()) {
      const direction = state[key].direction
      if (direction === null) {
        continue
      }
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

/**
 * `SortDirection` defines the ways in which a value can get sorted.
 * `null` defaults to `desc`.
 */
export type SortDirection = 'asc' | 'desc' | null

/**
 * `SortConfig` defines the keys by which a list of values can be sorted.
 * <p>
 *   {@link String} values can be automatically sorted by assigning their keys to `String` itself.
 *   {@link Number} values can be automatically sorted by assigning their keys to `Number` itself.
 *   Other values have to provide a custom compare function.
 * </p>
 */
type SortConfig<T, Ks extends string | keyof T> = {
  [K in Ks]:
    K extends keyof T
      ? T[K] extends string ? (typeof String | Compare<T>)
      : T[K] extends number ? (typeof Number | Compare<T>)
      : Compare<T>
      : Compare<T>
}

/**
 * `Compare` is a function comparing two values.
 */
interface Compare<T> {
  /**
   * Compares two values.
   *
   * @param a The first value.
   * @param b The second value.
   * @return A positive number if `a > b`, `0` if `a == b`, or a negative number if `a < b`.
   */
  (a: T, b: T): number
}

/**
 * `SortState` maps all fields by which a list can be sorted to a `SortField`.
 */
type SortState<Ks extends string> = {
  [K in Ks]: SortField
}

/**
 * `SortField` gives access to a sortable field.
 */
export interface SortField {
  /**
   * The direction in which the field is currently sorted.
   */
  direction: SortDirection,

  /**
   * Changes {@link direction}.
   *
   * @param direction The new direction.
   */
  setDirection(direction: SortDirection): void
}
