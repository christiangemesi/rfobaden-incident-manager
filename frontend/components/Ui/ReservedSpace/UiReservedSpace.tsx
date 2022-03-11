import React, { CSSProperties, ReactNode, useCallback, useMemo } from 'react'
import { ElementProps } from '@/utils/helpers/StyleHelper'
import useMaximumSize, { MaximumSize, useMaximumSizeScrollControl } from '@/utils/hooks/useMaximumSize'

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
 * @see useMaximumSize
 * @see useMaximumSizeScrollControl
 */
const UiReservedSpace: React.VFC<Props> = ({ reserveWidth = false, reserveHeight = false, style = {}, ...props }) => {
  const [setRef, max] = useMaximumSize()
  const seTargetRef = useMaximumSizeScrollControl(max)

  const setRefs = useCallback((ref: HTMLElement | null) => {
    setRef(ref)
    seTargetRef(ref)
  }, [])

  const reservedStyle = useMemo(() => {
    const newStyle = { ...style }
    if (reserveWidth) {
      newStyle.minWidth = max.width
    }
    if (reserveHeight) {
      newStyle.minHeight = max.height
    }
    return newStyle
  }, [style, max, reserveWidth, reserveHeight])

  return (
    <div ref={setRefs} {...props} style={reservedStyle} />
  )
}
export default UiReservedSpace
