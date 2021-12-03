import Incident from '@/models/Incident'
import React, { ReactNode, Ref } from 'react'
import styled from 'styled-components'
import UiGrid from '@/components/Ui/Grid/UiGrid'

interface Props {
  incident: Incident
  innerRef?: Ref<HTMLDivElement>
}

const IncidentView: React.VFC<Props> = ({ incident, innerRef }) => {

  return (
    <Container ref={innerRef}>
      <h1>
        {incident.title}
      </h1>
      <div style={{ width: '100%' }}>
        <UiGrid style={{ justifyContent: 'center' }}>
          <UiGrid.Col size={{ md: 8, lg: 5 }}>
            <Info name="Status">
              {getStatusMessage(incident)}
            </Info>
            {incident.isClosed && (
              <>
                <Info name="Abschlussgrund">
                  {incident.closeReason}
                </Info>
              </>
            )}

            <div style={{ marginTop: '1rem' }} />
            <Info name="erstellt am">
              {incident.createdAt.toLocaleString()}
            </Info>
            <Info name="zuletzt bearbeitet am">
              {incident.updatedAt.toLocaleString()}
            </Info>
            <Info name="gedruckt am" className="print-only">
              {new Date().toLocaleString()}
            </Info>
          </UiGrid.Col>
        </UiGrid>
      </div>
      <article style={{ marginTop: '1.5rem' }}>
        {incident.description}
      </article>
    </Container>
  )
}
export default IncidentView

interface InfoProp {
  name: string
  children: ReactNode
  className?: string
}

const Info: React.VFC<InfoProp> = ({ name, children, className }) => {
  return (
    <UiGrid gap={1} className={className}>
      <UiGrid.Col size={6} style={{ textAlign: 'right' }}>
        <span style={{ fontWeight: 600 }}>
          {name}
        </span>
      </UiGrid.Col>
      <UiGrid.Col>
        {children}
      </UiGrid.Col>
    </UiGrid>
  )
}

const getStatusMessage = (incident: Incident): string => {
  if (incident.isClosed) {
    return 'geschlossen'
  }
  if (incident.startsAt !== null && incident.startsAt > new Date()) {
    return 'ungeöffnet'
  }
  if (incident.endsAt !== null && incident.endsAt < new Date()) {
    return 'vorbei'
  }
  return 'geöffnet'
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`
