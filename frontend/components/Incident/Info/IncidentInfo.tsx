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
import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import OrganizationStore, { useOrganizations } from '@/stores/OrganizationStore'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import backendService, { BackendResponse } from '@/services/BackendService'
import Organization, { parseOrganization } from '@/models/Organization'
import OrganizationList from '@/components/Organization/List/OrganizationList'
import useAsyncEffect from '@/utils/hooks/useAsyncEffect'

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

  useAsyncEffect(async function loadOrganizations() {
    const [organizations, organizationError]: BackendResponse<Organization[]> = await backendService.list(
      'organizations',
    )
    if (organizationError !== null) {
      throw organizationError
    }
    OrganizationStore.saveAll(organizations.map(parseOrganization))
  }, [])

  const organizationsOfIncident = useOrganizations(
    (organizations) => organizations.filter(({ id }) => incident.organizationIds.includes(id)),
  )

  return (
    <UiCaptionList>
      <LinkCaption isEmphasis>
        <BackButton href="/ereignisse">Ereignis</BackButton>
      </LinkCaption>
      <UiDrawer size="full" align="top">
        <UiDrawer.Trigger>{({ open }) => (
          <UiCaption onClick={open}>
            {incident.organizationIds.length}
            &nbsp;
            {incident.organizationIds.length === 1 ? 'Organisation' : 'Organisationen'}
          </UiCaption>
        )}</UiDrawer.Trigger>
        <UiDrawer.Body>
          <UiGrid style={{ padding: '0 0 1rem 0' }}>
            <UiGrid.Col>
              <UiTitle level={1}>
                Beteiligte Organisationen
              </UiTitle>
            </UiGrid.Col>
          </UiGrid>
          <UiGrid.Col size={{ md: 10, lg: 8, xl: 6 }}>
            <OrganizationList organizations={organizationsOfIncident} />
          </UiGrid.Col>
        </UiDrawer.Body>
      </UiDrawer>

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

const LinkCaption = styled(UiCaption)`
  color: ${({ theme }) => theme.colors.secondary.contrast};
  transition: ease 100ms;
  transition-property: transform;

  &:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
`