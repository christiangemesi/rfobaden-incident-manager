import React, { useCallback, useState } from 'react'
import Report from '@/models/Report'
import UiList from '@/components/Ui/List/UiList'
import ReportListItem from '@/components/Report/List/Item/ReportListItem'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiCreatButton from '@/components/Ui/Button/UiCreateButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiTitle from '@/components/Ui/Title/UiTitle'
import ReportForm from '@/components/Report/Form/ReportForm'
import Incident from '@/models/Incident'
import styled, { css } from 'styled-components'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import ReportView from '@/components/Report/View/ReportView'
import UiContainer from '@/components/Ui/Container/UiContainer'

interface Props {
  incident: Incident
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

  return (
    <Container>
      <UiGrid style={{ height: '100%' }}>
        <UiGrid.Col size={selected ? { md: 4, xl: 3 } : 12} style={{ height: '100%' }}>
          <ListSpacer>
            <ListContainer hasSelected={selected !== null}>
              <UiModal isFull>
                <UiModal.Activator>{({ open }) => (
                  <UiCreatButton onClick={open}>
                    <UiIcon.CreateAction size={1.5} />
                  </UiCreatButton>
                )}</UiModal.Activator>
                <UiModal.Body>{({ close }) => (
                  <React.Fragment>
                    <UiTitle level={1} isCentered>
                      Meldung erfassen
                    </UiTitle>
                    <ReportForm incident={incident} onClose={close} />
                  </React.Fragment>
                )}</UiModal.Body>
              </UiModal>

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
        </UiGrid.Col>

        <UiGrid.Col style={{ height: '100%' }}>
          <ReportOverlay hasSelected={selected !== null}>
            {selected && <ReportView report={selected} onClose={clearSelected} />}
          </ReportOverlay>
        </UiGrid.Col>
      </UiGrid>
    </Container>
  )
}
export default ReportList

const Container = styled.div`
  height: 100%;
  width: 100%;
  overflow: auto;
`

const ListSpacer = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem 0;
  
  // Move scrollbar to the left.
  direction: rtl;
  & > * {
    direction: ltr;
  }
`

const ListContainer = styled.div<{ hasSelected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  ${UiContainer.variables}
  padding-right: ${({ hasSelected }) => hasSelected ? '0' : 'var(--ui-container--padding)'};
  padding-left: var(--ui-container--padding);
  margin-right: 2rem;
`

const ReportOverlay = styled.div<{ hasSelected: boolean }>`
  position: absolute;

  z-index: 2;

  width: 100%;
  height: 100%;

  background-color: ${({ theme }) => theme.colors.tertiary.value};
  box-shadow: 0 0 4px 2px gray;

  transition: 300ms cubic-bezier(.23,1,.32,1);
  transition-property: transform;

  transform: translateY(100%);
  transform-origin: bottom;

  padding: 1rem 0 1rem 2rem;
  
  overflow: hidden;

  ${({ hasSelected }) => hasSelected && css`
    transform: translateY(0);
  `}
`