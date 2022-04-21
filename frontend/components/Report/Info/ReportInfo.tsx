import Report from '@/models/Report'
import React from 'react'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiCaptionList from '@/components/Ui/Caption/List/UiCaptionList'
import { useUsername } from '@/models/User'
import { useUser } from '@/stores/UserStore'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import UiImageList from '@/components/Ui/Image/List/UiImageList'
import { FileId } from '@/models/FileUpload'
import ReportStore from '@/stores/ReportStore'

interface Props {
  report: Report
}

const ReportInfo: React.VFC<Props> = ({ report }) => {
  const assigneeName = useUsername(useUser(report.assigneeId))

  const storeImageIds = (ids: FileId[]) => {
    ReportStore.save({ ...report, imageIds: ids })
  }

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
      <UiDrawer size="full">
        <UiDrawer.Trigger>{({ open }) => (
          <UiCaption onClick={open}>
            {report.imageIds.length}
            &nbsp;
            {report.imageIds.length === 1 ? 'Bild' : 'Bilder'}
          </UiCaption>
        )}</UiDrawer.Trigger>
        <UiDrawer.Body>
          <UiImageList
            storeImageIds={storeImageIds}
            imageIds={report.imageIds}
            modelId={report.id}
            modelName="report" />
        </UiDrawer.Body>
      </UiDrawer>
    </UiCaptionList>
  )
}
export default ReportInfo
