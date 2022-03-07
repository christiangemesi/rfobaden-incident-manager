import Report from '@/models/Report'
import React from 'react'
import UiLabelList from '@/components/Ui/Label/List/UiLabelList'
import UiLabel from '@/components/Ui/Label/UiLabel'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import { useUsername } from '@/models/User'
import { useUser } from '@/stores/UserStore'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import styled from 'styled-components'

interface Props {
  report: Report
}

const ReportInfo: React.VFC<Props> = ({ report }) => {
  const assigneeName = useUsername(useUser(report.assigneeId))
  return (
    <UiLabelList>
      <UiLabel title="Ort / Gebiet">
        <UiIcon.Location />
        {report.location ?? (
          <MissingText>
            -
          </MissingText>
        )}
      </UiLabel>
      <UiLabel title="Zuweisung">
        <UiIcon.UserInCircle />
        {assigneeName ?? (
          <MissingText>
            -
          </MissingText>
        )}
      </UiLabel>
      <UiLabel>
        <UiIcon.Clock />
        <UiDateLabel start={report.startsAt ?? report.createdAt} end={report.endsAt} />
      </UiLabel>
    </UiLabelList>
  )
}
export default ReportInfo

const MissingText = styled.em`
  font-style: italic;
`