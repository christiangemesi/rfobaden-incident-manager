import React, {
  Children,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { noop } from '@/utils/control-flow'
import { usePrevious, useUpdate, useUpdateEffect } from 'react-use'
import UiPersist from '@/components/Ui/Persist/UiPersist'
import ReactDOM from 'react-dom'
import UiOverlay from '@/components/Ui/Overlay/UiOverlay'
import styled, { useTheme } from 'styled-components'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'

export interface Props {
  isOpen?: boolean
  isPersistent?: boolean
  children: ReactNode | RenderWithState
  onToggle?: (value: boolean) => void
  onOpen?: () => void
  onClose?: () => void
}

interface ConfigProps {
  renderContainer: (props: ContainerProps) => ReactNode
}

const UiModalLike: React.VFC<Props & ConfigProps> = ({
  isOpen,
  isPersistent,
  onToggle: handleToggle = noop,
  onOpen: handleOpen = noop,
  onClose: handleClose = noop,
  children,
  renderContainer,
}) => {
  // Shows if open state is controlled from the outside.
  const isControlled = isOpen !== undefined

  // Current open state.
  // This is a ref so it doesn't trigger renders.
  const isOpenRef = useRef(isOpen ?? false)
  isOpenRef.current = isOpen ?? isOpenRef.current

  // Current persistence state.
  // This is a ref so it doesn't trigger renders.
  const isPersistentRef = useRef(isPersistent ?? false)
  isPersistentRef.current = isPersistent ?? isPersistentRef.current

  // Forces the component to update.
  const forceUpdate = useUpdate()

  // Shows if the component is shaking.
  // The shake effect is used to signal that the component is persisted
  // and can't be closed by clicking outside it.
  const [isShaking, setShaking] = useState(false)

  // Shows if the component is currently running its open/close animation.
  const isAnimating = useRef(false)

  // Contains the current overall state of the component,
  // and functions to modify it.
  const state: State = useMemo(() => {
    const setOpen = isControlled ? handleToggle : (open: boolean) => {
      isOpenRef.current = open
      handleToggle(open)
      forceUpdate()
    }
    const toggle = (value?: boolean) => {
      const open = value ?? !isOpenRef.current
      if (open === isOpenRef.current) {
        return
      }
      setOpen(open)
      if (open) {
        handleOpen()
      } else {
        handleClose()
      }
    }
    const persist = isPersistent ? noop : () => {
      isPersistentRef.current = true
      forceUpdate()
    }
    return {
      get isOpen() {
        return isOpenRef.current
      },
      toggle,
      open() {
        toggle(true)
      },
      close() {
        toggle(false)
      },
      get isPersistent() {
        return isPersistentRef.current
      },
      persist,
    }
  }, [isControlled, isPersistent, handleToggle, handleClose, handleOpen, forceUpdate])

  // Closes the component, unless it is persisted.
  const theme = useTheme()
  const handleCloseAttempt = useCallback(() => {
    if (state.isPersistent) {
      setShaking(true)
      setTimeout(() => setShaking(false), theme.animations.shake.duration)
      return
    }
    state.close()
  }, [state, theme.animations.shake.duration])

  // Set the `isAnimating = true` if the open state has changed.
  // This signals that the modal will now execute the open or close animation.
  // During the close animation, the modals content has to be rendered still,
  // but it should be removed right after turning completely invisible.
  const previousOpenState = usePrevious(isOpenRef.current)
  if (previousOpenState !== isOpenRef.current) {
    isAnimating.current = true
  }
  useEffect(function resetAnimation() {
    if (previousOpenState === isOpenRef.current || !isAnimating.current) {
      return
    }
    const timeout = setTimeout(() => {
      isAnimating.current = false
      forceUpdate()
    }, 300)
    return () => clearTimeout(timeout)
  })

  // Reset the persistence flag after each close.
  useUpdateEffect(function resetPersistence() {
    isPersistentRef.current = isPersistent ?? false
  }, [state.isOpen, isPersistent])

  const [renderTrigger, renderBody] = useMemo(() => {
    if (typeof children === 'function') {
      return [(() => null) as RenderWithState, children as RenderWithState]
    }
    const elements = Children.toArray(children).map((it) => it as ReactElement)
    return [
      createRenderChild(elements, Trigger),
      createRenderChild(elements, Body),
    ]
  }, [children])

  const showContent = state.isOpen || isAnimating.current
  const content = showContent && renderBody(state)
  return (
    <UiPersist onPersist={state.persist}>
      {renderTrigger(state)}
      {ReactDOM.createPortal((
        <UiOverlay isOpen={state.isOpen} onClick={handleCloseAttempt}>
          {renderContainer({
            ...state,
            isShaking,
            children: content,
            nav: (
              <Nav>
                <UiIconButton title="Schliessen" onClick={state.close}>
                  <UiIcon.CancelAction />
                </UiIconButton>
              </Nav>
            ),
          })}
        </UiOverlay>
      ), document.body)}
    </UiPersist>
  )
}

interface State {
  readonly isOpen: boolean,
  readonly isPersistent: boolean
  open(): void
  close(): void
  toggle(value?: boolean): void
  persist(): void
}

export type RenderWithState = (state: State) => ReactNode

interface ChildProps {
  children: ReactNode | RenderWithState
}

const Trigger: React.VFC<ChildProps> = () => null
const Body: React.VFC<ChildProps> = () => null

const createRenderChild = (elements: ReactElement[], componentType: JSXElementConstructor<ChildProps>): RenderWithState => {
  const childRenderers = elements
    .filter((it) => it.type === componentType)
    .map((it) => (it.props as ChildProps).children)
    .map((child) => (
      typeof child === 'function'
        ? child as RenderWithState
        : () => <React.Fragment>{child}</React.Fragment>
    ))

  return (state: State): ReactNode => (
    childRenderers.map((render, i) => (
      <React.Fragment key={i}>
        {render(state)}
      </React.Fragment>
    ))
  )
}

interface ContainerProps extends State {
  isShaking: boolean
  nav: ReactNode
  children: ReactNode
}

const Nav = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`

export default Object.assign(UiModalLike, {
  Trigger,
  Body,
  Nav,
})

