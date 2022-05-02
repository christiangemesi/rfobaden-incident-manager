import Incident from '@/models/Incident'
import Report from '@/models/Report'
import React from 'react'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import ReportInfo from '@/components/Report/Info/ReportInfo'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiIconButtonGroup from '@/components/Ui/Icon/Button/Group/UiIconButtonGroup'
import ReportActions from '@/components/Report/Actions/ReportActions'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiDescription from '@/components/Ui/Description/UiDescription'
import styled from 'styled-components'
import UiPriority from '@/components/Ui/Priority/UiPriority'
import { mapEntryTypeToName } from '@/components/Report/Form/ReportForm'

interface Props {
  incident: Incident
  report: Report
  hasPriority?: boolean
  onClose?: () => void
}

const ReportViewHeader: React.VFC<Props> = ({
  incident,
  report,
  hasPriority = false,
  onClose: handleClose,
}) => {
  return (
    <Container>
      <UiGrid justify="space-between" align="start" gap={1} style={{ flexWrap: 'nowrap' }}>
        <TitleContainer>
          {hasPriority && (
            <UiPriority priority={report.priority} />
          )}
          <div>
            <ReportInfo report={report} />
            <UiTitle level={3}>
              {report.title}
            </UiTitle>
          </div>
        </TitleContainer>
        <UiIconButtonGroup>
          <ReportActions incident={incident} report={report} onDelete={handleClose} />
          <UiIconButton onClick={handleClose}>
            <UiIcon.CancelAction />
          </UiIconButton>
        </UiIconButtonGroup>
      </UiGrid>
      <UiDescription description={report.description} notes={report.notes} />
      <InfoTable>
        <tbody>
          <tr>
            <th>
              <UiTitle level={6}>Meldeart:</UiTitle>
            </th>
            <td>
              <span>{mapEntryTypeToName(report.entryType.source)}</span>
            </td>
          </tr>
          <tr>
            <th>
              <UiTitle level={6}>Nummer:</UiTitle>
            </th>
            <td>
              <span>{report.entryType.number ?? '-'}</span>
            </td>
          </tr>
        </tbody>
      </InfoTable>
    </Container>
  )
}
export default ReportViewHeader

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const InfoTable = styled.table`
  table-layout: fixed;
  text-align: left;
  th {
    width: 10rem;
  }
`