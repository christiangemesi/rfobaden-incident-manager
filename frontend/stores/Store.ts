import { Dispatch, useState } from 'react'
import { useEffectOnce, useIsomorphicLayoutEffect } from 'react-use'

export const useStore = <T>(store: Store<T>): T => {
  const inner = store[privateKey]

  const [globalState, setGlobalState] = useState(inner.state)
  useEffectOnce(() => () => {
    const i = inner.setters.indexOf(setGlobalState)
    if (i !== -1) {
      inner.setters.splice(i, 1)
    }
  })
  useIsomorphicLayoutEffect(() => {
    if (!inner.setters.includes(setGlobalState)) {
      inner.setters.push(setGlobalState)
    }
  })
  return globalState
}

export const createStore = <T, S>(initialState: T, actions: CreateActions<T, S>): Store<T> & S => {
  let state = initialState
  const setters = [] as Array<(value: T) => void>
  const setState: SetState<T> = (update): void => {
    state = typeof update === 'function' ? (update as (state: T) => T)(state) : update
    setters.forEach((set) => set(state))
  }

  const store: Store<T> & S = {
    ...actions(() => state, setState),
    [privateKey]: {
      get state(): T {
        return state
      },
      get setters() {
        return setters
      },
    },
  }
  return store
}

interface Store<T> {
  readonly [privateKey]: {
    state: T
    setters: Array<(value: T) => void>
  }
}

type SetState<T> = Dispatch<T | ((value: T) => T)>

interface CreateActions<T, S> {
  (getState: () => T, setState: SetState<T>): S
}

const privateKey = Symbol('Store.private')
