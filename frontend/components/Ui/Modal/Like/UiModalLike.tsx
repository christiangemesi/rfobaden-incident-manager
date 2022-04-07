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
import { createGlobalState, useKey, usePrevious, useUpdate, useUpdateEffect } from 'react-use'
import UiPersist from '@/components/Ui/Persist/UiPersist'
import ReactDOM from 'react-dom'
import UiOverlay from '@/components/Ui/Overlay/UiOverlay'
import styled, { useTheme } from 'styled-components'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'

export interface Props {
  /**
   * Forces the modal to be either open or closed.
   *
   * Using this property makes the modal a _controlled component_, which means that the open state
   * is expected to be provided entirely over this attribute. Internal changes to this value
   * are reported using {@link onToggle}, {@link onOpen} and {@link onClose}.
   */
  isOpen?: boolean

  /**
   * Sets the modal's persistence.
   * The persistence determines if the modal can be closed by either the Escape key or clicking outside it.
   *
   * Not setting this property will cause the persistence to be automatic.
   * Automatic persistence starts off as `false`, but may change depending on the contents of the form.
   */
  isPersistent?: boolean

  /**
   * The body and optionally triggers of the modal.
   *
   * @see Trigger
   * @see Body
   */
  children: ReactNode | RenderWithState

  /**
   * Event caused by the modal getting opened or closed.
   * @param value Whether the modal is getting opened or closed.
   */
  onToggle?: (value: boolean) => void

  /**
   * Event caused by the modal getting opened.
   */
  onOpen?: () => void

  /**
   * Event caused by the modal getting closed.
   */
  onClose?: () => void

  /**
   * Hides the modals default close button.
   */
  noCloseButton?: boolean
}

interface ConfigProps {
  renderContainer: (props: ContainerProps) => ReactNode
}

/**
 * `UiModalLike` is a base component which implements modal-like behaviour.
 * It does not specify how the component has to look or act.
 *
 * Components making use of `UiModalLike` have to have an open/close transition or animation of 300ms.
 */
const UiModalLike: React.VFC<Props & ConfigProps> = ({
  isOpen,
  isPersistent,
  noCloseButton = false,
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
  
  // The global level shows how many modals are open on top of each other.
  const [globalLevel] = useLevel()
  
  // The level shows on which level the modal has been opened.
  // A closed modal does have a level of `null`.
  const level = useRef<number | null>(null)

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
  const previousOpenState = usePrevious(state.isOpen) ?? false
  if (previousOpenState !== state.isOpen) {
    isAnimating.current = true
  }
  useEffect(function resetAnimation() {
    if (previousOpenState === state.isOpen || !isAnimating.current) {
      return
    }
    const timeout = setTimeout(() => {
      console.log('disable animation')
      isAnimating.current = false
      forceUpdate()
    }, 600)
    return () => clearTimeout(timeout)
  }, [state.isOpen, previousOpenState, forceUpdate])

  // Sets or resets the level of this modal when it is opened and closed.
  useEffect(function updateLevel() {
    if (state.isOpen === previousOpenState) {
      return
    }
    if (state.isOpen) {
      globalLevel.current += 1
      level.current = globalLevel.current
    } else {
      globalLevel.current -= 1
      level.current = null
    }
  }, [state.isOpen, previousOpenState, globalLevel])

  // Close the modal if the escape key is pressed.
  // The modal will not be closed if there are other modals open on top of it.
  useKey('Escape', () => {
    if (!state.isOpen || globalLevel.current !== level.current) {
      return
    }
    handleCloseAttempt()
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
            nav: noCloseButton ? null : (
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

/**
 * `Trigger` is a component that will render a modals trigger.
 * The trigger is an element that can cause the modal to open, such as a button.
 */
const Trigger: React.VFC<ChildProps> = () => null

/**
 * `Body` is a component that contains the modals content.
 */
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
  
  & > ${UiIconButton} {
    margin: 0;
  }
`

export const useLevel = createGlobalState({ current: 0 })

export default Object.assign(UiModalLike, {
  Trigger,
  Body,
  Nav,
})


