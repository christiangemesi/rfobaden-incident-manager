import React, { createContext, ReactNode, useContext } from 'react'
import { noop } from '@/utils/control-flow'


interface Props {
  onPersist: () => void
  children: ReactNode
}

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

interface ContextState {
  persist(): void
}

const Context = createContext<ContextState>({
  persist: noop,
})

export const usePersist = (): () => void => {
  const context = useContext(Context)
  return context.persist
}