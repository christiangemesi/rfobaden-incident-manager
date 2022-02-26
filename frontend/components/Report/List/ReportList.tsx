import React, { useState } from 'react'
import Report from '@/models/Report'
import UiList from '@/components/Ui/List/UiList'
import ReportListItem from '@/components/Report/List/Item/ReportListItem'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiCreatButton from '@/components/Ui/Button/UiCreateButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiTitle from '@/components/Ui/Title/UiTitle'
import ReportForm from '@/components/Report/Form/ReportForm'
import Incident from '@/models/Incident'
import styled from 'styled-components'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import ReportView from '@/components/Report/View/ReportView'

interface Props {
  incident: Incident
  reports: Report[]
  onSelect?: (report: Report) => void
  onDeselect?: () => void
}

const ReportList: React.VFC<Props> = ({ incident, reports, onSelect: handleSelect, onDeselect: handleDeselect  }) => {
  const [selected, setSelected] = useState<Report | null>(null)
  const setSelectedAndCallback = (report: Report | null) => {
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
  }
  return (
    <Container>
      <UiGrid gapH={2} align="stretch">
        <UiGrid.Col size={selected ? { md: 4, xl: 3 } : 12}>
          <ListContainer>
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
        </UiGrid.Col>

        {selected && (
          <UiGrid.Col style={{ minHeight: '100%' }}>
            <ReportViewContainer>
              <ReportView report={selected} />
            </ReportViewContainer>
          </UiGrid.Col>
        )}
      </UiGrid>
    </Container>
  )
}
export default ReportList

const Container = styled.div`
  min-height: 100%;
  margin-bottom: 2rem;
`

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
`

const ReportViewContainer = styled.div`
  //--y-offset: 4.65rem;
  --y-offset: 0px;
  
  display: flex;
  width: 100%;
  min-height: calc(100% - var(--y-offset));

  box-shadow: 0 0 4px 2px gray;
  padding: 1rem 2rem;
  margin-top: var(--y-offset);
  
  transition: 120ms ease-in;
  transition-property: transform;
  transform-origin: left center;
`