/* eslint-disable react-hooks/rules-of-hooks */

import { useCallback } from 'react'
import { useGetSet, useGetSetState, useUnmount } from 'react-use'
import { noop } from '@/utils/control-flow'


const useHeight = <E extends HTMLElement>(): [(ref: E) => void, number] => {
  if (typeof window === 'undefined') {
    return [noop, 0]
  }
  
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
  
  const setRef = useCallback((ref: E) => {
    getState().observer.observe(ref)
  }, [getState])
  useUnmount(() => {
    getState().observer.disconnect()
  })

  return [setRef, getState().height]
}
export default useHeight
