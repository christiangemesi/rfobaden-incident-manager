import React, { ReactNode, useCallback, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { Themed } from '@/theme'
import useHeight from '@/utils/hooks/useHeight'
import { useUpdateEffect } from 'react-use'
import Id from '@/models/base/Id'
import Model from '@/models/base/Model'
import { ModelStore } from '@/stores/base/Store'
import { createUseRecord } from '@/stores/base/hooks'
import { noop } from '@/utils/control-flow'
import Trackable from '@/models/Trackable'

interface Props<T extends Model> {
  /**
   * The id if the initial selected record, `null` if none is selected.
   */
  initialId?: Id<T> | null

  /**
   * Store of the record type.
   */
  store: ModelStore<T>

  /**
   * Map a record to its closed value.
   */
  isClosed: (record: T) => boolean

  /**
   * Content to render for the record list.
   */
  renderList: (props: { selected: T | null, select: (record: T | null) => void }) => ReactNode

  /**
   * Content to render for the selected record view.
   */
  renderView: (props: { selected: T, close: () => void }) => ReactNode

  /**
   * Event caused by selecting a record.
   */
  onSelect?: (record: T) => void

  /**
   * Event caused by deselecting a record.
   */
  onDeselect?: () => void
}

/**
 * `UiSideList` renders a list of records and if one of them is selected a view of the selected one.
 */
const UiSideList = <T extends Trackable>({
  initialId,
  store,
  isClosed,
  renderList,
  renderView,
  onSelect: handleSelect = noop,
  onDeselect: handleDeselect = noop,
}: Props<T>): JSX.Element => {
  const [setOverlayRef, overlayHeight] = useHeight<HTMLDivElement>()

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
    <Container>
      <ListContainer
        hasSelected={selectedId !== null}
        style={{
          minHeight: selectedId === null ? 0 : overlayHeight - 84,
        }}
      >
        {renderList({ selected, select: setSelected })}
      </ListContainer>

      <ListOverlay
        ref={setOverlayRef}
        hasSelected={selected !== null}
        isClosed={selected !== null && isClosed(selected)}
      >
        {selected === null ? null : renderView({ selected, close: clearSelected })}
      </ListOverlay>
    </Container>
  )
}
export default UiSideList

const Container = styled.div`
  display: flex;
`

const ListContainer = styled.div<{ hasSelected: boolean }>`
  position: relative;
  height: calc(100% - 4px);
  min-width: calc(100% - 0.8rem);
  z-index: 0;

  ${Themed.media.lg.min} {
    min-width: calc(100% - 4rem);
    z-index: 3;
  }
  
  transition: 300ms cubic-bezier(0.23, 1, 0.32, 1);
  will-change: min-width, max-width, width;
  transition-property: min-width, max-width, width;
  
  ${({ hasSelected }) => hasSelected && css`
    ${Themed.media.lg.min} {
      min-width: 35%;
      max-width: 35%;
    }
    ${Themed.media.xxl.min} {
      min-width: 25%;
      max-width: 25%;
    }
  `}
`

const ListOverlay = styled.div<{ hasSelected: boolean, isClosed: boolean }>`
  display: flex;
  min-height: 100%;
  overflow: hidden;
  z-index: 2;

  background-color: ${({ theme }) => theme.colors.tertiary.value};
  border: 1px solid ${({ theme }) => theme.colors.grey.value};

  transition: 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transition-property: transform, opacity;

  opacity: 0;
  transform: translateX(50vw);
  transform-origin: right center;
  
  ${({ hasSelected }) => hasSelected && css`
    opacity: 1;
    transform: translateX(0);
  `}
  
  width: calc(100% + 2px);
  
  ${Themed.media.lg.min} {
    width: calc(65% + 4rem);
  }
  ${Themed.media.xxl.min} {
    width: calc(75% + 4rem);
  }

  ${({ isClosed }) => isClosed && css`
    background-color: ${({ theme }) => theme.colors.grey.value};
    filter: brightness(1.2);
  `}
  
  ${Themed.media.md.max} {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% + 1px);
    transform: translateY(100%);
    
    ${({ hasSelected }) => hasSelected && css`
      transform: translateY(0);
    `}
  }
`
