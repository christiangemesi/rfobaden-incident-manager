import Report from '@/models/Report'
import React from 'react'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiCaptionList from '@/components/Ui/Caption/List/UiCaptionList'
import { useUsername } from '@/models/User'
import { useUser } from '@/stores/UserStore'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import { FileId } from '@/models/FileUpload'
import ReportStore from '@/stores/ReportStore'
import ImageDrawer from '@/components/Image/Drawer/ImageDrawer'
import DocumentDrawer from '@/components/Document/Drawer/DocumentDrawer'

interface Props {
  report: Report
}

const ReportInfo: React.VFC<Props> = ({ report }) => {
  const assigneeName = useUsername(useUser(report.assigneeId))

  const storeImageIds = (ids: FileId[]) => {
    ReportStore.save({ ...report, imageIds: ids })
  }

  const storeDocumentIds = (ids: FileId[]) => {
    ReportStore.save({ ...report, documentIds: ids })
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
      <ImageDrawer
        modelId={report.id}
        modelName="report"
        storeImageIds={storeImageIds}
        imageIds={report.imageIds}
      />
      <DocumentDrawer
        modelId={report.id}
        modelName="report"
        storeDocumentIds={storeDocumentIds}
        documentIds={report.documentIds}
      />
    </UiCaptionList>
  )
}
export default ReportInfo
