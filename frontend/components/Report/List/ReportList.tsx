import React, { useCallback, useMemo, useRef, useState } from 'react'
import Report from '@/models/Report'
import UiList from '@/components/Ui/List/UiList'
import ReportListItem from '@/components/Report/List/Item/ReportListItem'
import styled, { css } from 'styled-components'
import ReportView from '@/components/Report/View/ReportView'
import UiContainer from '@/components/Ui/Container/UiContainer'
import { Themed } from '@/theme'
import UiScroll from '@/components/Ui/Scroll/UiScroll'
import UiTitle from '@/components/Ui/Title/UiTitle'

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

  const [keyReports, normalReports] = useMemo(() => (
    reports.reduce(([key, normal], report) => {
      if (report.isKeyReport) {
        key.push(report)
      } else {
        normal.push(report)
      }
      return [key, normal]
    }, [[] as Report[], [] as Report[]])
  ), [reports])

  return (
    <Container ref={containerRef}>
      <UiScroll style={{ height: '100%' }} isLeft={selected === null} disableX>
        <ListSpacer hasSelected={selected !== null}>
          <ListContainer hasSelected={selected !== null}>
            <UiList>
              {keyReports.map((report) => (
                <ReportListItem
                  key={report.id}
                  report={report}
                  isActive={selected?.id === report.id}
                  isSmall={selected !== null}
                  onClick={setSelectedAndCallback}
                />
              ))}
            </UiList>

            <UiList>
              {normalReports.map((report) => (
                <ReportListItem
                  key={report.id}
                  report={report}
                  isActive={selected?.id === report.id}
                  isSmall={selected !== null}
                  onClick={setSelectedAndCallback}
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
  position: relative;
  height: calc(100% - 4px);
  width: 100%;
  margin-top: 4px;
  z-index: 3;

  will-change: width;
  transition: 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transition-property: width;
  
  ${({ hasSelected }) => hasSelected && css`
    ${Themed.media.xl.min} {
      width: 35vw;
    }
    ${Themed.media.xxl.min} {
      width: 25vw;
    }
  `}
`

const ListContainer = styled.div<{ hasSelected: boolean }>`
  ${UiContainer.fluidCss}
  
  display: flex;
  flex-direction: column;
  gap: 2rem;

  ${({ hasSelected }) => hasSelected && css`
    ${Themed.media.xl.min} {
      padding-right: 2rem;
    }
  `}
`

const ReportOverlay = styled.div<{ offset: number, hasSelected: boolean }>`
  position: fixed;
  top: calc(${({ offset }) => offset}px + 4px);

  z-index: 2;

  width: 100%;
  height: calc(100% - 4px - ${({ offset }) => offset}px);

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
    left: 35vw;
    width: 65vw;
  }

  ${Themed.media.xxl.min} {
    left: 25vw;
    width: 75vw;
  }
`