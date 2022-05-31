import { createContext, RefObject } from 'react'
import { noop } from '@/utils/control-flow'

/**
 * `UiDropDownState` is the state of a {@link UiDropDownContext}.
 */
export interface UiDropDownState {
  /**
   * A ref containing the dropdown's outermost container element.
   * Is `null` if the dropdown has not been mounted yet.
   */
  containerRef: RefObject<HTMLElement | null>

  /**
   * Whether the dropdown is currently open.
   */
  isOpen: boolean

  /**
   * Opens and closes the dropdown.
   */
  setOpen: (open: boolean) => void

  /**
   * Toggles from open to close and vice-versa.
   */
  toggle: () => void
}

/**
 * `UiDropDownContext` is a React context used by `UiDropDown` and its children.
 */
const UiDropDownContext = createContext<UiDropDownState>({
  containerRef: { current: null },
  isOpen: false,
  setOpen: noop,
  toggle: noop,
})
export default UiDropDownContext
