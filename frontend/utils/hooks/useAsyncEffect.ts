import { useEffect } from 'react'

/**
 * `useAsyncEffect` is React hook that works like `useEffect`,
 * but allows for async callbacks.
 * <p>
 *   Note that due to the nature of async callbacks, the hook
 *   does not support returning a destructor.
 * </p>
 * @param effect The async effect.
 * @param deps The dependencies which can cause the effect.
 */
const useAsyncEffect = (effect: () => Promise<void>, deps: unknown[]): void => {
  useEffect(() => {
    effect().then()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
export default useAsyncEffect
