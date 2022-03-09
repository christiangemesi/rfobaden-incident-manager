import Report from '@/models/Report'
import React from 'react'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiCaptionList from '@/components/Ui/Caption/List/UiCaptionList'
import { useUsername } from '@/models/User'
import { useUser } from '@/stores/UserStore'
import UiCaption from '@/components/Ui/Caption/UiCaption'

interface Props {
  report: Report
}

const ReportInfo: React.VFC<Props> = ({ report }) => {
  const assigneeName = useUsername(useUser(report.assigneeId))

  return (
    <UiCaptionList>
      <UiCaption isEmphasis>
        Meldung
      </UiCaption>
      {report.location && (
        <UiCaption>
          {report.location}
        </UiCaption>
      )}
      {assigneeName && (
        <UiCaption>
          {assigneeName}
        </UiCaption>
      )}
      <UiCaption>
        <UiDateLabel start={report.startsAt ?? report.createdAt} end={report.endsAt} />
      </UiCaption>
    </UiCaptionList>
  )
}
export default ReportInfo
