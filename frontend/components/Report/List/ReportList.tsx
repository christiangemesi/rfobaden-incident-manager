import React, { useCallback, useMemo, useRef, useState } from 'react'
import Report from '@/models/Report'
import UiList from '@/components/Ui/List/UiList'
import ReportListItem from '@/components/Report/List/Item/ReportListItem'
import styled, { css } from 'styled-components'
import ReportView from '@/components/Report/View/ReportView'
import UiContainer from '@/components/Ui/Container/UiContainer'
import { Themed } from '@/theme'
import UiScroll from '@/components/Ui/Scroll/UiScroll'
import useBreakpoint from '@/utils/hooks/useBreakpoints'
import { useEvent } from 'react-use'
import EventHelper from '@/utils/helpers/EventHelper'
import Incident from '@/models/Incident'
import UiReservedSpace from '@/components/Ui/ReservedSpace/UiReservedSpace'
import UiLevel from '@/components/Ui/Level/UiLevel'

interface Props {
  incident: Incident,
  reports: Report[]
  onSelect?: (report: Report) => void
  onDeselect?: () => void
}

const ReportList: React.VFC<Props> = ({ incident, reports, onSelect: handleSelect, onDeselect: handleDeselect  }) => {
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

  const canListBeSmall = useBreakpoint(() => ({
    xs: false,
    xl: true,
  }))

  const canDeselectByClick = useBreakpoint(() => ({
    xs: true,
    xl: false,
  }))
  useEvent('click', useCallback(() => {
    if (canDeselectByClick) {
      setSelected(null)
    }
  }, [canDeselectByClick]))

  return (
    <Container ref={containerRef} onClick={EventHelper.stopPropagation}>
      <ListSpacer hasSelected={selected !== null}>
        <ListContainer hasSelected={selected !== null}>
          <UiList>
            {keyReports.map((report) => (
              <ReportListItem
                key={report.id}
                report={report}
                isActive={selected?.id === report.id}
                isSmall={canListBeSmall && selected !== null}
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
                isSmall={canListBeSmall && selected !== null}
                onClick={setSelectedAndCallback}
              />
            ))}
          </UiList>
        </ListContainer>
      </ListSpacer>

      <ReportOverlay offset={containerRef.current?.getBoundingClientRect()?.y ?? 0} hasSelected={selected !== null}>
        <UiReservedSpace reserveHeight style={{ flex: 1, display: 'flex' }}>
          {selected !== null && (
            <ReportView incident={incident} report={selected} onClose={clearSelected} />
          )}
        </UiReservedSpace>
      </ReportOverlay>
    </Container>
  )
}
export default ReportList

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`

const ListSpacer = styled.div<{ hasSelected: boolean }>`
  position: relative;
  height: calc(100% - 4px);
  width: 100%;
  margin-top: 4px;
  
  z-index: 0;
  ${Themed.media.xl.min} {
    z-index: 3;
  }
  
  will-change: width;
  transition: 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transition-property: width;
  
  ${({ hasSelected }) => hasSelected && css`
    ${Themed.media.xl.min} {
      width: 35%;
    }
    ${Themed.media.xxl.min} {
      width: 25%;
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
  position: absolute;
  display: flex;
  top: 4px;

  z-index: 2;

  width: 100%;
  min-height: calc(100% - 4px);

  background-color: ${({ theme }) => theme.colors.tertiary.value};
  box-shadow: 0 0 4px 2px gray;

  transition: 300ms cubic-bezier(.23,1,.32,1);
  transition-property: transform;

  transform: translateX(100%);
  ${Themed.media.md.max} {
    transform: translateY(100%);
  }
  
  transform-origin: right center;
  
  overflow: hidden;

  ${({ hasSelected }) => hasSelected && css`
    transform: translateX(0);
    ${Themed.media.md.max} {
      transform: translateY(0);
    }
  `}
  
  ${Themed.media.lg.min} {
    ${UiLevel.Header}, ${UiLevel.Content} {
      padding-left: 2rem;
    }
  }
  
  ${Themed.media.xl.min} {
    left: 35%;
    width: 65%;
  }

  ${Themed.media.xxl.min} {
    left: 25%;
    width: 75%;
  }
`
