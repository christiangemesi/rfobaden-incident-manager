import React, { createContext, ReactNode, useContext } from 'react'
import { noop } from '@/utils/control-flow'

interface Props {
  /**
   * Event caused by children asking to be persisted.
   * Note that this callback has to implement the actual persistence logic.
   */
  onPersist: () => void

  /**
   * The content that can be persisted.
   */
  children: ReactNode
}

/**
 * `UiPersist` is a component that allows its children to signal that their
 * state has been changed and should not get easily discarded.
 * <p>
 *   This behavior is used by modals and drawers to detect if their content contains changes.
 *   For example, a form inside a modal may ask to be persisted when it is changed,
 *   causing the modal to not be closeable by simply clicking the escape key.
 * </p>
 */
const UiPersist: React.VFC<Props> = ({
  onPersist: handlePersist,
  children,
}) => {
  return (
    <Context.Provider value={{ persist: handlePersist }}>
      {children}
    </Context.Provider>
  )
}
export default UiPersist

/**
 * `ContextState` is the state of a {@link UiPersist} {@link Context}.
 */
interface ContextState {
  persist(): void
}

/**
 * The context of the current {@link UiPersist}.
 */
const Context = createContext<ContextState>({
  persist: noop,
})

/**
 * `usePersist` is a React hook that returns a persist callback.
 * Invoking the callback will signal that the current context should be persisted.
 */
export const usePersist = (): () => void => {
  const context = useContext(Context)
  return context.persist
}