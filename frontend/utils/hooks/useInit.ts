import { useRef } from 'react'

/**
 * `useInit` is a hook that will execute a function exactly once per component instance.
 * The function will be executed _inline_, that is, in the body of the component.
 *
 * Note that this does not mean that the initializer function can use other hooks.
 * Since the function is executed conditionally, it must act like a normal callback.
 *
 * @param init The function to execute.
 */
const useInit = (init: () => void): void => {
  const isInitialized = useRef(false)
  if (!isInitialized.current) {
    isInitialized.current = true
    init()
  }
}
export default useInit
