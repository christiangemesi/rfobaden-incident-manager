import Incident from '@/models/Incident'
import React, { useCallback, useState } from 'react'
import UiLevel from '@/components/Ui/Level/UiLevel'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import IncidentInfo from '@/components/Incident/Info/IncidentInfo'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiDescription from '@/components/Ui/Description/UiDescription'
import { useReport, useReportsOfIncident } from '@/stores/ReportStore'
import ReportList from '@/components/Report/List/ReportList'
import ReportView from '@/components/Report/View/ReportView'
import styled, { css } from 'styled-components'
import { Themed } from '@/theme'
import Report from '@/models/Report'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import UiContainer from '@/components/Ui/Container/UiContainer'
import { useMeasure, usePreviousDistinct } from 'react-use'
import Id from '@/models/base/Id'
import IncidentActions from '@/components/Incident/Actions/IncidentActions'
import UiIcon from '@/components/Ui/Icon/UiIcon'

interface Props extends StyledProps {
  incident: Incident
  onDelete?: () => void
}

const IncidentView: React.VFC<Props> = ({ incident, onDelete: handleDelete, className, style }) => {
  const reports = useReportsOfIncident(incident.id)

  const [selectedId, setSelectedId] = useState<Id<Report> | null>(null)
  const selected = useReport(selectedId)
  const setSelected = useCallback((report: Report | null) => {
    setSelectedId(report?.id ?? null)
  }, [])
  const clearSelected = useCallback(() => {
    setSelectedId(null)
  }, [])

  const [setReportListRef, { height: reportListHeight }] = useMeasure<HTMLDivElement>()
  const prevReportListHeight = usePreviousDistinct(reportListHeight) ?? reportListHeight


  return (
    <UiLevel className={className} style={style}>
      <UiLevel.Header>
        <UiGrid justify="space-between" align="start" gap={1} style={{ flexWrap: 'nowrap' }}>
          <UiGrid.Col>
            <IncidentInfo incident={incident} />
            <UiTitle level={1}>
              {incident.title}
            </UiTitle>
          </UiGrid.Col>

          <UiGrid.Col size="auto">
            <IncidentActions incident={incident} onDelete={handleDelete} />
            <UiIcon.Empty style={{ marginLeft: '0.5rem' }} />
          </UiGrid.Col>
        </UiGrid>

        <UiDescription description={incident.description} />
      </UiLevel.Header>
      <StyledUiLevelContent $hasSelected={selected !== null}>
        <ListContainer ref={setReportListRef} $hasSelected={selected !== null}>
          <ReportList reports={reports} selected={selected} onSelect={setSelected} />
        </ListContainer>

        <ReportOverlay hasSelected={selected !== null} $listHeight={prevReportListHeight}>
          {selected !== null && (
            <ReportView incident={incident} report={selected} onClose={clearSelected} />
          )}
        </ReportOverlay>
      </StyledUiLevelContent>
    </UiLevel>
  )
}
export default IncidentView

const StyledUiLevelContent = styled(UiLevel.Content)<{ $hasSelected: boolean }>`
  overflow: hidden;
  ${Themed.media.lg.min} {
    display: flex;
    padding-right: 0;
  }

  ${Themed.media.md.max} {
    padding-left: 0;
    padding-right: 0;
  }
`

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

const ReportOverlay = styled.div<{ hasSelected: boolean, $listHeight: number }>`
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
    
    // transform: translateY(calc(100% + 4px + 1rem)); // 4px to hide box shadow, 1rem for parent padding
  }
`
