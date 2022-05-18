import React, { useMemo } from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import styled from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiLink from '@/components/Ui/Link/UiLink'
import { GetServerSideProps } from 'next'
import { BackendResponse, getSessionFromRequest } from '@/services/BackendService'
import Incident, { isClosedIncident, parseIncident } from '@/models/Incident'
import { useEffectOnce } from 'react-use'
import IncidentStore, { useIncidents } from '@/stores/IncidentStore'
import { Themed } from '@/theme'
import Page from '@/components/Page/Page'

interface Props {
  data: {
    incidents: Incident[]
  }
}

const HomePage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    IncidentStore.saveAll(data.incidents.map(parseIncident))
  })

  const firstIncident = useIncidents().find((it) => !isClosedIncident(it)) ?? null

  const dashboardPanels = useMemo(() => {
    const panels = [
      { icon: UiIcon.IncidentManagement, label: 'Ereignisse', link: '/ereignisse' },
      { icon: UiIcon.UserManagement, label: 'Benutzer', link: '/benutzer' },
      { icon: UiIcon.Organization, label: 'Organisationen', link: '/organisationen' },
      { icon: UiIcon.Archive, label: 'Archiv', link: '/ereignisse/archiv' },
    ]
    if (firstIncident !== null) {
      // Only show transport panel if there is at least one open incident.
      panels.splice(1, 0, {
        icon: UiIcon.Transport,
        label: 'Transporte',
        link: `/ereignisse/${firstIncident.id}/transporte`,
      })
    }
    return panels
  }, [firstIncident])

  return (
    <Page>
      <UiContainer>
        <UiTitle level={1} isCentered>
          IncidentManager
        </UiTitle>
        <Subtitle>
          Regionales Führungsorgan Baden
        </Subtitle>
        <Panels>
          <UiGrid gap={1.5} justify="center">
            {dashboardPanels.map((card) => (
              <UiGrid.Col key={card.label} size={{ xs: 12, sm: 6 }}>
                <UiLink href={card.link}>
                  <Card>
                    <card.icon size={5} />
                    <CardTitle level={4}>{card.label}</CardTitle>
                  </Card>
                </UiLink>
              </UiGrid.Col>
            ))}
          </UiGrid>
        </Panels>
      </UiContainer>
    </Page>
  )
}
export default HomePage

const Subtitle = styled.div`
  width: 100%;
  text-align: center;
  margin-top: -0.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
`
  
const Card = styled.div`
  height: 15rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.secondary.contrast};
  background-color: ${({ theme }) => theme.colors.secondary.value};
  
  border-radius: 0.5rem;
  
  transition: 250ms ease;
  transition-property: background-color;
  
  :hover:not(&[disabled]), :active:not(&[disabled]) {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.hover.value};
  }
`
  
const CardTitle = styled(UiTitle)`
  text-align: center;
`

const Panels = styled.div`
  display: flex;
  justify-content: center;
  
  & > ${UiGrid} {
    ${Themed.media.md.min} {
      width: 80%;
    }
    ${Themed.media.lg.min} {
      width: 70%;
    }
    ${Themed.media.xl.min} {
      width: 60%;
    }
  }
`

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user, backendService } = getSessionFromRequest(req)
  if (user === null) {
    return { redirect: { statusCode: 302, destination: '/anmelden' }}
  }

  const [incidents, incidentsError]: BackendResponse<Incident[]> = await backendService.list('incidents')
  if (incidentsError !== null) {
    throw incidentsError
  }

  return {
    props: {
      data: {
        incidents,
      },
    },
  }
}
