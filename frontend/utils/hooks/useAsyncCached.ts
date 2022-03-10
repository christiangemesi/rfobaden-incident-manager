import { useAsync } from 'react-use'
import { AsyncState } from 'react-use/lib/useAsyncFn'
import { useMemo } from 'react'

/**
 * `useAsyncCached` is a hook that works like [useAsync]{@link useAsync}, but caches return values.
 * This guarantees for a given cache and key, no async operation is executed more than once.
 * This cache
 *
 * @param cacheId The value identifying the cache across multiple component instances.
 *                This can be the component function itself.
 *                Setting this value to `null` will use a cache local to the component instance.
 * @param key The cache key, used to cache values and trigger loads.
 * @param load Callback function to load a new value.
 *
 * @see useAsync
 */
const useAsyncCached = <K, V>(cacheId: unknown, key: K, load: (key: K) => Promise<V>): AsyncState<V> => {
  const cache: Map<K, V> = useMemo(() => {
    if (cacheId === null) {
      return new Map()
    }
    if (caches.has(cacheId)) {
      return caches.get(cacheId) as Map<K, V>
    }
    const newCache = new Map<K, V>()
    caches.set(cacheId, newCache)
    return newCache
  }, [cacheId])

  return useAsync(async () => {
    if (cache.has(key)) {
      return cache.get(key) as V
    }
    const result = await load(key)
    cache.set(key, result)
    return result
  }, [cache, key])
}
export default useAsyncCached

const caches = new Map<unknown, unknown>()