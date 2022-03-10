import React, { CSSProperties, ReactNode, useRef } from 'react'
import { useMeasure, useSetState, useUpdateEffect, useWindowScroll } from 'react-use'
import { ElementProps } from '@/utils/helpers/StyleHelper'

interface Props extends ElementProps<HTMLDivElement> {
  /**
   * Allow width to be reserved.
   */
  reserveWidth?: boolean

  /**
   * Allow height to be reserved.
   */
  reserveHeight?: boolean

  /**
   * The content to be tracked.
   */
  children: ReactNode
}

/**
 * `UiReservedSpace` is a wrapper component that tracks the size (width and/or) height of its' contents,
 * and remembers their highest value. It then takes that maximum size, even if the content itself shrinks.
 *
 * This behaviour is meant to solve scrollbar jumps, where the content is changed after scrolling the window,
 * and the new content does not have the same size as previously. This will cause the scrollbar to jump upwards,
 * which can be very irritating to look at.
 *
 * The component will consistently monitor the current window scroll, and reduce the reserved space if it can
 * without affecting the scroll position.
 */
const UiReservedSpace: React.VFC<Props> = ({ reserveWidth = false, reserveHeight = false, style = {}, ...props }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [setMeasureRef, { width, height }] = useMeasure<HTMLDivElement>()
  useUpdateEffect(() => {
    if (ref.current !== null) {
      setMeasureRef(ref.current)
    }
  }, [ref.current])

  const [reserved, setReserved] = useSetState<Reserved>({
    width: null,
    height: null,
  })

  useUpdateEffect(() => {
    setReserved({ width: reserveWidth ? width : null })
  }, [width, setReserved, reserveWidth])

  useUpdateEffect(() => {
    setReserved({ height: reserveHeight ? height : null })
  }, [height, setReserved, reserveHeight])

  // Reduce the reserved space when part of it is outside of the viewport.
  const scroll = useWindowScroll()
  useUpdateEffect(() => {
    if (ref.current === null) {
      return
    }
    const bounds = ref.current.getBoundingClientRect()
    if (bounds.right > (window.innerWidth || document.documentElement.clientWidth)) {
      setReserved({ width: document.documentElement.clientWidth - bounds.x })
    }
    if (bounds.bottom > (window.innerHeight || document.documentElement.clientHeight)) {
      setReserved({ height: document.documentElement.clientHeight - bounds.y })
    }
  }, [scroll])

  return (
    <div ref={ref} {...props} style={makeReservedStyle(style, reserved)} />
  )
}
export default UiReservedSpace

interface Reserved {
  width: number | null
  height: number | null
}

const makeReservedStyle = (style: CSSProperties, reserved: Reserved): CSSProperties => {
  const newStyle = { ...style }
  newStyle.minWidth = reserved.width ?? undefined
  newStyle.minHeight = reserved.height ?? undefined
  return newStyle
}
