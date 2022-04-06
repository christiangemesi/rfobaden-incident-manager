import { createContext, RefObject } from 'react'
import { noop } from '@/utils/control-flow'

export interface UiDropDownState {
  containerRef: RefObject<HTMLElement | null>
  isOpen: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

const UiDropDownContext = createContext<UiDropDownState>({
  containerRef: { current: null },
  isOpen: false,
  setOpen: noop,
  toggle: noop,
})
export default UiDropDownContext
