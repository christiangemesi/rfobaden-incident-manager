import { noop, run } from '@/utils/control-flow'

class ScrollHelper {
  disableScroll(target: HTMLElement | Window) {
    target.addEventListener('DOMMouseScroll', stopEvent, false) // older FF
    target.addEventListener(WHEEL_EVENT_NAME, stopEvent, WHEEL_EVENT_OPTIONS) // modern desktop
    target.addEventListener('touchmove', stopEvent, WHEEL_EVENT_OPTIONS) // mobile
    target.addEventListener('keydown', stopEventForScrollKeys as never, false)
  }

  enableScroll(target: HTMLElement | Window) {
    target.removeEventListener('DOMMouseScroll', stopEvent, false) // older FF
    target.removeEventListener(WHEEL_EVENT_NAME, stopEvent) // modern desktop
    target.removeEventListener('touchmove', stopEvent) // mobile
    target.removeEventListener('keydown', stopEventForScrollKeys as never, false)
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

// Event handler which calls `stopPropagation`.
const stopEvent = (e: Event) => {
  e.stopPropagation()
}


// Keyboard event handler which calls `preventDefault` if the key can scroll the page.
const stopEventForScrollKeys = (e: KeyboardEvent) => {
  if (SCROLL_KEYS.has(e.key)) {
    stopEvent(e)
    return false
  }
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
