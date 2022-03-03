import React, { useCallback, useRef, useState } from 'react'
import Report from '@/models/Report'
import UiList from '@/components/Ui/List/UiList'
import ReportListItem from '@/components/Report/List/Item/ReportListItem'
import styled, { css } from 'styled-components'
import ReportView from '@/components/Report/View/ReportView'
import UiContainer from '@/components/Ui/Container/UiContainer'
import { Themed } from '@/theme'
import UiScroll from '@/components/Ui/Scroll/UiScroll'

interface Props {
  reports: Report[]
  onSelect?: (report: Report) => void
  onDeselect?: () => void
}

const ReportList: React.VFC<Props> = ({ reports, onSelect: handleSelect, onDeselect: handleDeselect  }) => {
  const [selected, setSelected] = useState<Report | null>(null)
  const setSelectedAndCallback = useCallback((report: Report | null) => {
    if (report === null) {
      if (handleDeselect) {
        handleDeselect()
      }
    } else {
      if (handleSelect) {
        handleSelect(report)
      }
    }
    setSelected(report)
  }, [handleSelect, handleDeselect])
  const clearSelected = useCallback(() => {
    setSelectedAndCallback(null)
  }, [setSelectedAndCallback])

  const containerRef = useRef<HTMLDivElement | null>(null)

  return (
    <Container ref={containerRef}>
      <UiScroll style={{ height: '100%' }} isLeft={selected !== null} disableX>
        <ListSpacer hasSelected={selected !== null}>
          <ListContainer hasSelected={selected !== null}>
            <UiList>
              {reports.map((report) => (
                <ReportListItem
                  key={report.id}
                  report={report}
                  onClick={setSelectedAndCallback}
                  isActive={selected?.id === report.id}
                />
              ))}
            </UiList>
          </ListContainer>
        </ListSpacer>

        <ReportOverlay offset={containerRef.current?.getBoundingClientRect()?.y ?? 0} hasSelected={selected !== null}>
          {selected && <ReportView report={selected} onClose={clearSelected} />}
        </ReportOverlay>
      </UiScroll>
    </Container>
  )
}
export default ReportList

const Container = styled.div`
  height: 100%;
  width: 100%;
`

const ListSpacer = styled.div<{ hasSelected: boolean }>`
  height: 100%;
  width: 100%;
  padding: 1rem 0;

  will-change: width;
  transition: 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transition-property: width;
  
  ${({ hasSelected }) => hasSelected && css`
    ${Themed.media.xl.min} {
      width: 35vw;
    }
  `}
`

const ListContainer = styled.div<{ hasSelected: boolean }>`
  ${UiContainer.fluidCss}
  
  display: flex;
  flex-direction: column;
  gap: 1rem;

  ${({ hasSelected }) => hasSelected && css`
    ${Themed.media.xl.min} {
      padding-right: 2rem;
    }
  `}
`

const ReportOverlay = styled.div<{ offset: number, hasSelected: boolean }>`
  position: fixed;
  top: calc(${({ offset }) => offset}px + 1rem);

  z-index: 2;

  width: 100%;
  height: calc(100% - 1rem - ${({ offset }) => offset}px);

  background-color: ${({ theme }) => theme.colors.tertiary.value};
  box-shadow: 0 0 4px 2px gray;

  transition: 300ms cubic-bezier(.23,1,.32,1);
  transition-property: transform;

  transform: translateX(100%);
  transform-origin: right center;
  
  overflow: hidden;

  ${({ hasSelected }) => hasSelected && css`
    transform: translateX(0);
  `}
  
  ${Themed.media.lg.max} {
    padding: 1rem 0;
  }
  
  ${Themed.media.xl.min} {
    width: 65vw;
    left: 35vw;
  }
`