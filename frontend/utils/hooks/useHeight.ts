/* eslint-disable react-hooks/rules-of-hooks */

import { useCallback, useRef } from 'react'
import { useGetSet, useUnmount } from 'react-use'
import { noop } from '@/utils/control-flow'

/**
 * `useHeight` is a React hook that monitors the height of a HTML element.
 * It re-renders when the height changes.
 *
 * @example
 *
 * const [elementRef, elementHeight] = useHeight<HTMLDivElement>()
 * return (
 *   <div ref={elementRef}>
 *     This element has a height of {elementHeight} pixels.
 *   </div>
 * )
 */
const useHeight = <E extends HTMLElement>(): [(ref: E | null) => void, number] => {
  if (typeof window === 'undefined') {
    return [noop, 0]
  }

  const ref = useRef<E | null>(null)
  const [getState, setState] = useGetSet(() => ({
    height: 0,
    observer: new ResizeObserver((entries) => {
      const entry = entries[0]
      const height = ~~entry.contentRect.height
      if (height !== getState().height) {
        setState((state) => ({ ...state, height }))
      }
    }),
  }))
  
  const setRef = useCallback((element: E | null) => {
    const state = getState()
    if (element === null) {
      if (ref.current !== null) {
        state.observer.unobserve(ref.current)
      }
    } else {
      state.observer.observe(element)
    }
    ref.current = element
  }, [getState])
  useUnmount(() => {
    getState().observer.disconnect()
  })

  return [setRef, getState().height]
}
export default useHeight
