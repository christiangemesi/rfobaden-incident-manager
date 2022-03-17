import React, { ReactNode, RefObject, useState } from 'react'
import UiDropDownItem from '@/components/Ui/DropDown/Item/UiDropDownItem'
import UiDropDownTrigger from '@/components/Ui/DropDown/Trigger/UiDropDownTrigger'
import UiDropDownContext, { UiDropDownState } from './Context/UiDropDownContext'
import UiDropDownMenu from '@/components/Ui/DropDown/Menu/UiDropDownMenu'
import styled from 'styled-components'
import { useEffectOnce, useGetSet } from 'react-use'
import EventHelper from '@/utils/helpers/EventHelper'

interface Props {
  children: ReactNode
}

const UiDropDown: React.VFC<Props> = ({ children }) => {
  const [getState, setState] = useGetSet<UiDropDownState>(() => ({
    containerRef: { current: null },
    isOpen: false,
    setOpen: (isOpen: boolean) => setState((state) => ({ ...state, isOpen })),
    toggle: () => setState((state) => ({ ...state, isOpen: !state.isOpen })),
  }))

  useEffectOnce(() => {
    const close = () => {
      if (getState().isOpen) {
        setState((state) => ({ ...state, isOpen: false }))
      }
    }
    window.addEventListener('click', close)
    return () => {
      window.removeEventListener('click', close)
    }
  })

  return (
    <UiDropDownContext.Provider value={getState()}>
      <Container ref={getState().containerRef as RefObject<HTMLDivElement>} onClick={EventHelper.stopPropagation}>
        {children}
      </Container>
    </UiDropDownContext.Provider>
  )
}

export default Object.assign(UiDropDown, {
  Trigger: UiDropDownTrigger,
  Menu: UiDropDownMenu,
  Item: UiDropDownItem,
})

const Container = styled.span`
  position: relative;
`