import { Dispatch, MutableRefObject, RefCallback, SetStateAction, useRef, useState } from 'react'
import { useMeasure, useUpdateEffect, useWindowScroll } from 'react-use'
import { run } from '@/utils/control-flow'

/**
 * `useMaximumSize` tracks the size (width and/or) height of a HTMLElement, and remembers their highest value.
 * It then returns that maximum size, even if the content itself shrinks.
 */
const useMaximumSize = (): [RefCallback<HTMLElement>, MaximumSize] => {
  const [reserved, setReserved] = useState<{ width: number, height: number }>(() => ({
    width: 0,
    height: 0,
  }))

  const [ref, setRef] = useState<HTMLElement | null>(null)

  const [setMeasureRef, { width, height }] = useMeasure<HTMLElement>()
  useUpdateEffect(() => {
    if (ref !== null) {
      setMeasureRef(ref)
    }
  }, [ref])

  useUpdateEffect(() => {
    setReserved({ width: Math.max(reserved.width, width), height: Math.max(reserved.height, height) })
  }, [width, height])

  return [setRef, { ...reserved, source: ref, update: setReserved }]
}
export default useMaximumSize

/**
 * `useMaximumSizeScrollControl` resets a `MaximumSize` when an element sized by it goes out of the viewport
 * enough for it to be made smaller without having an impact on the scrollbar.
 *
 * This is meant to solve scrollbar jumps, where content is changed after scrolling the window,
 * and the new content does not have the same size as previously. This will cause the scrollbar to jump upwards,
 * which can be very irritating to look at.
 */
export const useMaximumSizeScrollControl = <E extends HTMLElement>(max: MaximumSize): MutableRefObject<E | null> => {
  const ref = useRef<E | null>(null)

  // Reduce the reserved space when part of it is outside of the viewport.
  const scroll = useWindowScroll()
  useUpdateEffect(() => {
    if (ref.current === null || max.source === null) {
      return
    }
    const bounds = ref.current.getBoundingClientRect()
    const sourceBounds = max.source.getBoundingClientRect()

    if (sourceBounds.width < max.width) run(() => {
      if (scroll.x === 0) {
        max.update((max) => ({ ...max, width: 0 }))
        return
      }

      const windowWidth = window.innerWidth || document.documentElement.clientWidth

      // The part of the elements' width which is currently outside the viewport.
      const invisibleWidth = windowWidth - bounds.right
      if (invisibleWidth < 0) {
        // The elements' width has been resized, and the viewport can be lowered without affecting the scrollbar.
        max.update((max) => ({ ...max, width: max.width + invisibleWidth }))
      }
    })

    if (sourceBounds.height < max.height) run(() => {
      if (scroll.y === 0) {
        max.update((max) => ({ ...max, height: 0 }))
        return
      }

      const windowHeight = window.innerHeight || document.documentElement.clientHeight

      // The part of the elements' height which is currently outside the viewport.
      const invisibleHeight = windowHeight - bounds.bottom
      if (invisibleHeight < 0) {
        // The elements' height has been resized, and the viewport can be lowered without affecting the scrollbar.
        max.update((max) => ({ ...max, height: max.height + invisibleHeight }))
      }
    })
  }, [scroll])
  return ref
}

export interface MaximumSize {
  source: HTMLElement | null

  width: number
  height: number

  /**
   * Manually updates the maximum size.
   * Can be used to reset the size to lower values.
   *
   * @param size The new maximum values.
   */
  update: Dispatch<SetStateAction<{ width: number, height: number }>>
}
