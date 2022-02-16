import React, { CSSProperties, ReactNode, useRef } from 'react'
import { useMeasure, useSetState, useUpdateEffect, useWindowScroll } from 'react-use'

interface Props {
  children?: ReactNode
}

const UiReservedSpace: React.VFC<Props> = ({ children }) => {
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
    setReserved({ width })
  }, [setReserved, width])

  useUpdateEffect(() => {
    setReserved({ height })
  }, [setReserved, height])

  // Reduce the reserved space when part of it is outside of the viewport.
  const scroll = useWindowScroll()
  useUpdateEffect(() => {
    if (ref.current === null) {
      return
    }
    const bounds = ref.current.getBoundingClientRect()
    if (bounds.bottom > (window.innerHeight || document.documentElement.clientHeight)) {
      setReserved({ height: document.documentElement.clientHeight - bounds.y })
    }
    if (bounds.right > (window.innerWidth || document.documentElement.clientWidth)) {
      setReserved({ width: document.documentElement.clientWidth - bounds.x })
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
