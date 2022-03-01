import { noop, run } from '@/utils/control-flow'

class ScrollHelper {
  disableScroll(target: HTMLElement | Window) {
    target.addEventListener('DOMMouseScroll', handleWithPreventDefault, false) // older FF
    target.addEventListener(WHEEL_EVENT_NAME, handleWithPreventDefault, WHEEL_EVENT_OPTIONS) // modern desktop
    target.addEventListener('touchmove', handleWithPreventDefault, WHEEL_EVENT_OPTIONS) // mobile
    target.addEventListener('keydown', handleWithPreventDefaultForScrollKeys as never, false)
  }

  enableScroll(target: HTMLElement | Window) {
    target.removeEventListener('DOMMouseScroll', handleWithPreventDefault, false) // older FF
    target.removeEventListener(WHEEL_EVENT_NAME, handleWithPreventDefault) // modern desktop
    target.removeEventListener('touchmove', handleWithPreventDefault) // mobile
    target.removeEventListener('keydown', handleWithPreventDefaultForScrollKeys as never, false)
  }

  enableScrollCapture(target: HTMLElement) {
    target.addEventListener('DOMMouseScroll', handleWithStopPropagation, false) // older FF
    target.addEventListener(WHEEL_EVENT_NAME, handleWithStopPropagation, WHEEL_EVENT_OPTIONS) // modern desktop
    target.addEventListener('touchmove', handleWithStopPropagation, WHEEL_EVENT_OPTIONS) // mobile
    target.addEventListener('keydown', handleWithStopPropagation, false)
  }

  disableScrollCapture(target: HTMLElement) {
    target.removeEventListener('DOMMouseScroll', handleWithStopPropagation, false) // older FF
    target.removeEventListener(WHEEL_EVENT_NAME, handleWithStopPropagation) // modern desktop
    target.removeEventListener('touchmove', handleWithStopPropagation) // mobile
    target.removeEventListener('keydown', handleWithStopPropagation, false)
  }

  get isPassiveSupported() {
    return IS_PASSIVE_SUPPORTED
  }
}
export default new ScrollHelper()

// The keys which can be used for scrolling.
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'])

// Whether passive event listeners are supported by the current environment.
// Since there's no nice way to detect if this is true,
// we have to check if creating a passive listener makes use of the 'passive' option to detect this.
const IS_PASSIVE_SUPPORTED = run(() => {
  if (typeof window === 'undefined') {
    return false
  }
  let isSupported = false
  const passiveTestCallback = Object.defineProperty({}, 'passive', {
    get() {
      isSupported = true
    },
  })
  window.addEventListener('test-passive' as keyof WindowEventMap, noop, passiveTestCallback)
  window.removeEventListener('test-passive' as keyof WindowEventMap, noop, passiveTestCallback)
  return isSupported
})

// Event handler which simply calls `preventDefault`.
const handleWithPreventDefault = (e: Event) => {
  e.preventDefault()
}

// Keyboard event handler which calls `preventDefault` if the key can scroll the page.
const handleWithPreventDefaultForScrollKeys = (e: KeyboardEvent) => {
  if (SCROLL_KEYS.has(e.key)) {
    handleWithPreventDefault(e)
    return false
  }
}

// Event handler which stops event propagation.
const handleWithStopPropagation = (e: Event) => {
  e.stopPropagation()
}

// The name of the mouse wheel event.
const WHEEL_EVENT_NAME = run(() => {
  if (typeof window === 'undefined' || 'onwheel' in document.createElement('div')) {
    return 'wheel'
  }
  return 'mousewheel'
})

// Options to use when binding a mouse wheel listener.
const WHEEL_EVENT_OPTIONS = IS_PASSIVE_SUPPORTED ? { passive: false } : false
