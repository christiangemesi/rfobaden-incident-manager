import { createContext } from 'react'
import { noop } from '@/utils/control-flow'

export interface UiModalState {
  visibility: UiModalVisibility
  isOpen: boolean
  open(): void
  close(): void
  toggle(): void

  isFull: boolean

  isPersistent: boolean
  setPersistent(value: boolean): void
  persist(): void
}

export enum UiModalVisibility {
  CLOSED,
  CLOSING,
  OPEN,
  OPENING,
}

const UiModalContext = createContext<UiModalState>({
  isFull: false,

  visibility: UiModalVisibility.CLOSED,
  isOpen: false,
  open: noop,
  close: noop,
  toggle: noop,

  isPersistent: false,
  setPersistent: noop,
  persist: noop,
})
export default UiModalContext

export const animationMillis = 300