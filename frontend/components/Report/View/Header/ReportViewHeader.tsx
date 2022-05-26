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
  /**
   * The incident the report belongs to.
   */
  incident: Incident

  /**
   * The report to display.
   */
  report: Report

  /**
   * Whether a report has a priority to display.
   */
  hasPriority?: boolean

  /**
   * Event caused by closing the report view.
   */
  onClose?: () => void
}

/**
 * `ReportViewHeader` displays detailed information about the report.
 */
const ReportViewHeader: React.VFC<Props> = ({
  incident,
  report,
  hasPriority = false,
  onClose: handleClose,
}) => {
  return (
    <Container>
      <UiGrid justify="space-between" align="start" gap={1}>
        <UiGrid.Col>
          <ReportInfo report={report} />
        </UiGrid.Col>

        <UiGrid.Col size="auto" textAlign="right">
          <UiIconButtonGroup>
            <ReportActions incident={incident} report={report} onDelete={handleClose} />
            <UiIconButton onClick={handleClose}>
              <UiIcon.CancelAction />
            </UiIconButton>
          </UiIconButtonGroup>
        </UiGrid.Col>
      </UiGrid>

      <TitleContainer>
        {hasPriority && (
          <UiPriority priority={report.priority} />
        )}
        <div style={{ width: '100%' }}>
          <UiTitle level={2}>
            {report.title}
          </UiTitle>
        </div>
      </TitleContainer>

      <InfoContainer>
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
                <UiTitle level={6}>Melder-Info:</UiTitle>
              </th>
              <td>
                <span>{report.entryType.descriptor ?? '-'}</span>
              </td>
            </tr>
          </tbody>
        </InfoTable>
      </InfoContainer>
    </Container>
  )
}
export default ReportViewHeader

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 0.5rem;
  width: 100%;
  margin-top: 1rem;
  padding-left: 0.15rem;
`

const InfoTable = styled.table`
  table-layout: fixed;
  text-align: left;
  
  th {
    width: 10rem;
  }
`
