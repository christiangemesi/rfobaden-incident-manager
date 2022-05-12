import { useEffect } from 'react'

const useAsyncEffect = (effect: () => Promise<void>, deps: unknown[]): void => {
  useEffect(() => {
    effect().then()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
export default useAsyncEffect
