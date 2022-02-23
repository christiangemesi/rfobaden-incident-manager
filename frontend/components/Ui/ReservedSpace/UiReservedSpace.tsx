import React, { CSSProperties, ReactNode, useRef } from 'react'
import { useMeasure, useSetState, useUpdateEffect, useWindowScroll } from 'react-use'

interface Props {
  reserveWidth?: boolean
  reserveHeight?: boolean
  children?: ReactNode
}

const UiReservedSpace: React.VFC<Props> = ({ reserveWidth = false, reserveHeight = false, children }) => {
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
    <div ref={ref} style={makeReservedStyle(reserved)}>
      {children}
    </div>
  )
}
export default UiReservedSpace

interface Reserved {
  width: number | null
  height: number | null
}

const makeReservedStyle = (reserved: Reserved): CSSProperties => {
  const props: CSSProperties = {}
  props.minWidth = reserved.width ?? undefined
  props.minHeight = reserved.height ?? undefined
  return props
}
