import React from 'react'
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

interface Props {
  incident: Incident
  reports: Report[]
  activeReport: Report | null
  onClick?: (report: Report) => void
}

const ReportList: React.VFC<Props> = ({ incident, reports, activeReport, onClick: handleClick }) => {
  return (
    <Container>
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
            onClick={handleClick}
            isActive={activeReport !== null && activeReport.id == report.id}
          />
        ))}
      </UiList>
    </Container>
  )
}
export default ReportList

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`