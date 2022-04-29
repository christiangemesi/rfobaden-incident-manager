import { useEffect, useMemo, useState } from 'react'

/**
 * `useCachedEffect` is a hook that allows for cached asynchronous effects.
 * This guarantees for a given cache and key, no async operation is executed more than once.
 *
 * @param cacheId The value identifying the cache across multiple component instances.
 *                This can be the component function itself.
 *                Setting this value to `null` will use a cache local to the component instance.
 * @param key The cache key, used to cache values and trigger loads.
 * @param load Callback function to execute.
 * @returns `true` if the there's currently an effect being executed.
 */
const useCachedEffect = <T>(cacheId: unknown, key: T, load: (key: T) => Promise<void>): boolean => {
  const cache: Set<T> = useMemo(() => {
    if (cacheId === null) {
      return new Set()
    }
    if (caches.has(cacheId)) {
      return caches.get(cacheId) as Set<T>
    }
    const newCache = new Set<T>()
    caches.set(cacheId, newCache)
    return newCache
  }, [cacheId])

  const [isLoading, setLoading] = useState(false)
  useEffect(() => {
    if (cache.has(key)) {
      return
    }
    setLoading(true)
    cache.add(key)
    load(key).then(() => {
      setLoading(false)
    })
  }, [cache, key, load])
  return isLoading
}
export default useCachedEffect

/**
 * `loadCached` provides the same functionality as the `useCachedEffect` hook,
 * but allows it to be used outside a React component.
 */
export const loadCached = async <T>(cacheId: unknown, key: T, load: (key: T) => Promise<void>): Promise<void> => {
  const cache = resolveCache(cacheId)
  if (cache.has(key)) {
    return Promise.resolve()
  }
  cache.add(key)
  await load(key)
}

const caches = new Map<unknown, unknown>()

const resolveCache = <T>(cacheId: unknown): Set<T> => {
  if (cacheId === null) {
    return new Set()
  }
  if (caches.has(cacheId)) {
    return caches.get(cacheId) as Set<T>
  }
  const newCache = new Set<T>()
  caches.set(cacheId, newCache)
  return newCache
}
