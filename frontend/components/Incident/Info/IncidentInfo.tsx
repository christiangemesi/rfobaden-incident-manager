import Incident from '@/models/Incident'
import React, { useCallback } from 'react'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiCaptionList from '@/components/Ui/Caption/List/UiCaptionList'
import IncidentStore from '@/stores/IncidentStore'
import Document from '@/models/Document'
import DocumentImageDrawer from '@/components/Document/Image/Drawer/DocumentImageDrawer'
import DocumentDrawer from '@/components/Document/Drawer/DocumentDrawer'
import UiLink from '@/components/Ui/Link/UiLink'
import styled from 'styled-components'

interface Props {
  incident: Incident
}

const IncidentInfo: React.VFC<Props> = ({ incident }) => {

  const storeImages = (images: Document[]) => {
    IncidentStore.save({ ...incident, images: images })
  }

  const storeDocuments = (documents: Document[]) => {
    IncidentStore.save({ ...incident, documents: documents })
  }

  const addImage = useCallback((image: Document) => {
    IncidentStore.save({ ...incident, images: [...incident.images, image]})
  }, [incident])

  const addDocument = useCallback((document: Document) => {
    IncidentStore.save({ ...incident, documents: [...incident.documents, document]})
  }, [incident])

  return (
    <UiCaptionList>
      <UiCaption isEmphasis>
        <BackButton href="/ereignisse">Ereignis</BackButton>
      </UiCaption>
      <UiCaption>
        {incident.organizationIds.length}
        &nbsp;
        {incident.organizationIds.length === 1 ? 'Organisation' : 'Organisationen'}
      </UiCaption>
      <UiCaption>
        <UiDateLabel start={incident.startsAt ?? incident.createdAt} end={incident.endsAt} />
      </UiCaption>

      <DocumentImageDrawer
        images={incident.images}
        storeImages={storeImages}
        modelId={incident.id}
        modelName="incident"
        onAddImage={addImage}
      />
      <DocumentDrawer
        documents={incident.documents}
        storeDocuments={storeDocuments}
        modelId={incident.id}
        modelName="incident"
        onAddDocument={addDocument}
      />
    </UiCaptionList>
  )
}
export default IncidentInfo

const BackButton = styled(UiLink)`
  color: ${({ theme }) => theme.colors.secondary.contrast};
`