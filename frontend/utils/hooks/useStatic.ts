import { useMemo } from 'react'

/**
 * `useStatic` will compute a value once, and then return that value everytime.
 * The value is never recomputed, as long as the component instance does not change.
 */
export const useStatic = <T>(factory: () => T): T => (
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(factory, [])
)
