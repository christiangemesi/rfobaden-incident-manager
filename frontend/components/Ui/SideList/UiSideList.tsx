import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import UiLevel from '@/components/Ui/Level/UiLevel'
import { Themed } from '@/theme'
import ReportList from '@/components/Report/List/ReportList'
import UiContainer from '@/components/Ui/Container/UiContainer'
import useHeight from '@/utils/hooks/useHeight'
import { usePreviousDistinct, useUpdateEffect } from 'react-use'
import Id from '@/models/base/Id'
import Model from '@/models/base/Model'
import { ModelStore } from '@/stores/base/Store'
import { createUseRecord } from '@/stores/base/hooks'
import { noop } from '@/utils/control-flow'

interface Props<T extends Model> {
  initialId?: Id<T> | null
  store: ModelStore<T>

  renderList: (props: { selected: T | null, select: (record: T | null) => void }) => ReactNode
  renderView: (props: { selected: T, close: () => void }) => ReactNode

  onSelect?: (record: T) => void
  onDeselect?: () => void
}

const UiSideList = <T extends Model>({
  initialId,
  store,
  renderList,
  renderView,
  onSelect: handleSelect = noop,
  onDeselect: handleDeselect = noop,
}: Props<T>): JSX.Element => {
  const [setListRef, listHeight] = useHeight<HTMLDivElement>()
  const prevListHeight = usePreviousDistinct(listHeight) ?? listHeight

  const [selectedId, setSelectedId] = useState<Id<T> | null>(initialId ?? null)
  const setSelected = useCallback((report: T | null) => {
    setSelectedId(report?.id ?? null)
  }, [])
  const clearSelected = useCallback(() => {
    setSelectedId(null)
  }, [])

  const useSelected = useMemo(() => createUseRecord(store), [store])
  const selected = useSelected(selectedId)

  useUpdateEffect(() => {
    if (selectedId === null) {
      handleDeselect()
    } else {
      const record = store.find(selectedId)
      if (record !== null) {
        handleSelect(record)
      }
    }
  }, [selectedId])

  return (
    <React.Fragment>
      <ListContainer ref={setListRef} $hasSelected={selectedId !== null}>
        {renderList({ selected, select: setSelected })}
      </ListContainer>
      <ListOverlay hasSelected={selected !== null} $listHeight={prevListHeight}>
        {selected === null ? null : renderView({ selected, close: clearSelected })}
      </ListOverlay>
    </React.Fragment>
  )
}
export default UiSideList


const ListContainer = styled.div<{ $hasSelected: boolean }>`
  position: relative;
  height: calc(100% - 4px);
  min-width: calc(100% - 0.8rem);
  ${Themed.media.md.min} {
    min-width: calc(100% - 4rem);
  }
  
  z-index: 0;
  ${Themed.media.xl.min} {
    z-index: 3;
  }
  
  transition: 300ms cubic-bezier(0.23, 1, 0.32, 1);
  will-change: min-width, max-width, width;
  transition-property: min-width, max-width, width;
  
  ${({ $hasSelected }) => $hasSelected && css`
    ${Themed.media.lg.min} {
      min-width: 35%;
      max-width: 35%;
      
      & > ${ReportList} {
        padding-right: 2rem;
      }
    }
    ${Themed.media.xxl.min} {
      min-width: 25%;
      max-width: 25%;
    }
  `}


  ${Themed.media.md.max} {
    ${UiContainer.fluidCss};
    
    ${({ $hasSelected }) => $hasSelected && css`
      max-height: 0;
    `}
  }
`

const ListOverlay = styled.div<{ hasSelected: boolean, $listHeight: number }>`
  display: flex;
  min-height: 100%;
  overflow: hidden;
  z-index: 2;

  background-color: ${({ theme }) => theme.colors.tertiary.value};
  box-shadow: 0 0 4px 2px gray;

  transition: 300ms cubic-bezier(.23,1,.32,1);
  transition-property: transform;

  transform: translateX(calc(100% + 4px)); // 4px to hide box shadow
  transform-origin: right center;
  ${({ hasSelected }) => hasSelected && css`
    transform: translateX(0);
  `}

  ${Themed.media.lg.min} {
    ${UiLevel.Header}, ${UiLevel.Content} {
      padding-left: 2rem;
    }
  }
  ${Themed.media.xl.min} {
    width: calc(65% + 4rem);
  }
  ${Themed.media.xxl.min} {
    width: calc(75% + 4rem);
  }

  ${Themed.media.md.max} {
    width: 100%;
    min-height: ${({ $listHeight }) => $listHeight}px;
    transform: translateY(calc(100% + 44px));
    ${({ hasSelected }) => hasSelected && css`
      transform: translateY(0);
    `}
  }
`
