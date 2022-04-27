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

interface Props {
  incident: Incident
  report: Report
  onClose?: () => void
}

const ReportViewHeader: React.VFC<Props> = ({ incident, report, onClose: handleClose }) => {
  return (
    <React.Fragment>
      <UiGrid justify="space-between" align="start" gap={1} style={{ flexWrap: 'nowrap' }}>
        <div>
          <ReportInfo report={report} />
          <UiTitle level={3}>
            {report.title}
          </UiTitle>
        </div>
        <UiIconButtonGroup>
          <ReportActions incident={incident} report={report} onDelete={handleClose} />
          <UiIconButton onClick={handleClose}>
            <UiIcon.CancelAction />
          </UiIconButton>
        </UiIconButtonGroup>
      </UiGrid>
      <UiDescription description={report.description} notes={report.notes} />
    </React.Fragment>
  )
}
export default ReportViewHeader