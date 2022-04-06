import Transport from '@/models/Transport'
import React from 'react'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiCaptionList from '@/components/Ui/Caption/List/UiCaptionList'
import { useUsername } from '@/models/User'
import { useUser } from '@/stores/UserStore'
import UiCaption from '@/components/Ui/Caption/UiCaption'

interface Props {
  transport: Transport
}

const TransportInfo: React.VFC<Props> = ({ transport }) => {
  const assigneeName = useUsername(useUser(transport.assigneeId))

  return (
    <UiCaptionList>
      <UiCaption isEmphasis>
        Transport
      </UiCaption>
      {assigneeName && (
        <UiCaption>
          {assigneeName}
        </UiCaption>
      )}
      <UiCaption>
        <UiDateLabel start={transport.startsAt ?? transport.createdAt} end={transport.endsAt} />
      </UiCaption>
    </UiCaptionList>
  )
}
export default TransportInfo
