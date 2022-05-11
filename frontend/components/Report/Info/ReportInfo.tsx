import Report from '@/models/Report'
import React, { useCallback } from 'react'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiCaptionList from '@/components/Ui/Caption/List/UiCaptionList'
import { useUsername } from '@/models/User'
import { useUser } from '@/stores/UserStore'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import { Document } from '@/models/FileUpload'
import ReportStore from '@/stores/ReportStore'
import DocumentImageDrawer from '@/components/Document/Image/Drawer/DocumentImageDrawer'
import DocumentDrawer from '@/components/Document/Drawer/DocumentDrawer'

interface Props {
  report: Report
}

const ReportInfo: React.VFC<Props> = ({ report }) => {
  const assigneeName = useUsername(useUser(report.assigneeId))

  const storeImages = (images: Document[]) => {
    ReportStore.save({ ...report, images: images })
  }

  const storeDocuments = (documents: Document[]) => {
    ReportStore.save({ ...report, documents: documents })
  }

  const addImage = useCallback((image: Document) => {
    ReportStore.save({ ...report, images: [...report.images, image]})
  }, [report])

  const addDocument = useCallback((document: Document) => {
    ReportStore.save({ ...report, documents: [...report.documents, document]})
  }, [report])


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
      <DocumentImageDrawer
        modelId={report.id}
        modelName="report"
        images={report.images}
        storeImages={storeImages}
        onAddDocument={addImage}
      />
      <DocumentDrawer
        modelId={report.id}
        modelName="report"
        documents={report.documents}
        storeDocuments={storeDocuments}
        onAddDocument={addDocument}
      />
    </UiCaptionList>
  )
}
export default ReportInfo
