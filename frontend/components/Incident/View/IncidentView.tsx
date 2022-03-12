import Incident, { parseIncident } from '@/models/Incident'
import React, { useCallback, useState } from 'react'
import UiLevel from '@/components/Ui/Level/UiLevel'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import IncidentInfo from '@/components/Incident/Info/IncidentInfo'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiModal from '@/components/Ui/Modal/UiModal'
import ReportForm from '@/components/Report/Form/ReportForm'
import IncidentForm from '@/components/Incident/Form/IncidentForm'
import UiDescription from '@/components/Ui/Description/UiDescription'
import BackendService, { BackendResponse } from '@/services/BackendService'
import IncidentStore from '@/stores/IncidentStore'
import { useRouter } from 'next/router'
import { useReportsOfIncident } from '@/stores/ReportStore'
import ReportList from '@/components/Report/List/ReportList'
import ReportView from '@/components/Report/View/ReportView'
import styled, { css } from 'styled-components'
import { Themed } from '@/theme'
import Report from '@/models/Report'
import { StyledProps } from '@/utils/helpers/StyleHelper'

interface Props extends StyledProps {
  incident: Incident
}

const IncidentView: React.VFC<Props> = ({ incident, className, style }) => {
  const reports = useReportsOfIncident(incident.id)
  const [selected, setSelected] = useState<Report | null>(null)

  const clearSelected = useCallback(() => {
    setSelected(null)
  }, [])

  const router = useRouter()
  const handleClose = useCallback(async () => {
    const message = prompt(`Sind sie sicher, dass sie das Ereignis "${incident.title}" schliessen wollen?\nGrund:`)
    if (message === null) {
      return
    }
    if (message.trim().length === 0) {
      confirm(`Das Ereignis "${incident.title}" wurde nicht geschlossen.\nDie Begründung fehlt.`)
      return
    }
    const [data, error]: BackendResponse<Incident> = await BackendService.update(`incidents/${incident.id}/close`, { message })
    if (error !== null) {
      throw error
    }
    IncidentStore.save(parseIncident(data))
  }, [incident])

  const handleReopen = useCallback(async () => {
    if (confirm(`Sind sie sicher, dass sie das Ereignis "${incident.title}" wieder öffnen wollen?`)) {
      const [data, error] = await BackendService.update<number, Incident>(`incidents/${incident.id}/reopen`, incident.id)
      if (error !== null) {
        throw error
      }
      IncidentStore.save(parseIncident(data))
    }
  }, [incident])

  const handleDelete = useCallback(async () => {
    if (confirm(`Sind sie sicher, dass sie das Ereignis "${incident.title}" löschen wollen?`)) {
      await BackendService.delete('incidents', incident.id)
      await router.push('/ereignisse')
      IncidentStore.remove(incident.id)
    }
  }, [incident, router])

  return (
    <UiLevel className={className} style={style}>
      <UiLevel.Header>
        <UiGrid justify="space-between" align="start" gap={1} style={{ flexWrap: 'nowrap' }}>

          <UiGrid.Col>
            <IncidentInfo incident={incident} />
            <UiTitle level={1}>
              {incident.title}
            </UiTitle>
          </UiGrid.Col>

          <UiGrid.Col size="auto">
            <UiDropDown>

              <UiDropDown.Trigger>
                <UiIconButton>
                  <UiIcon.More />
                </UiIconButton>
              </UiDropDown.Trigger>

              <UiModal isFull>
                <UiModal.Activator>{({ open }) => (
                  <UiDropDown.Item onClick={open}>
                    Neue Meldung
                  </UiDropDown.Item>
                )}</UiModal.Activator>
                <UiModal.Body>{({ close }) => (
                  <React.Fragment>
                    <UiTitle level={1} isCentered>
                      Meldung erfassen
                    </UiTitle>
                    <ReportForm incident={incident} onClose={close} />
                  </React.Fragment>
                )}</UiModal.Body>
              </UiModal>

              <UiModal isFull>
                <UiModal.Activator>{({ open }) => (
                  <UiDropDown.Item onClick={open}>Bearbeiten</UiDropDown.Item>
                )}</UiModal.Activator>
                <UiModal.Body>{({ close }) => (
                  <React.Fragment>
                    <UiTitle level={1} isCentered>
                      Ereignis bearbeiten
                    </UiTitle>
                    <IncidentForm incident={incident} onClose={close} />
                  </React.Fragment>
                )}</UiModal.Body>
              </UiModal>

              {incident.isClosed ? (
                <UiDropDown.Item onClick={handleReopen}>
                  Öffnen
                </UiDropDown.Item>
              ) : (
                <UiDropDown.Item onClick={handleClose}>
                  Schliessen
                </UiDropDown.Item>
              )}
              <UiDropDown.Item onClick={handleDelete}>Löschen</UiDropDown.Item>

            </UiDropDown>
          </UiGrid.Col>
        </UiGrid>

        <UiDescription description={incident.description} />

      </UiLevel.Header>
      <StyledUiLevelContent $hasSelected={selected !== null}>
        <ListContainer $hasSelected={selected !== null}>
          <ReportList reports={reports} selected={selected} onSelect={setSelected} />
        </ListContainer>

        <ReportOverlay hasSelected={selected !== null}>
          {selected !== null && (
            <ReportView incident={incident} report={selected} onClose={clearSelected} />
          )}
        </ReportOverlay>
      </StyledUiLevelContent>
    </UiLevel>
  )
}
export default IncidentView

const StyledUiLevelContent = styled(UiLevel.Content)<{ $hasSelected: boolean }>`
  overflow: hidden;
  display: flex;
  padding-right: 0;
`

const ListContainer = styled.div<{ $hasSelected: boolean }>`
  position: relative;
  height: calc(100% - 4px);
  min-width: calc(100% - 0.8rem);
  ${Themed.media.md.min} {
    min-width: calc(100% - 4rem);
  }
  
  z-index: 0;
  ${Themed.media.xl.min} {
    z-index: 3;
  }
  
  will-change: min-width, max-width, width;
  transition: 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transition-property: min-width, max-width, width;
  
  ${({ $hasSelected }) => $hasSelected && css`
    ${Themed.media.xl.min} {
      min-width: 35%;
      max-width: 35%;
      
      & > ${ReportList} {
        padding-right: 2rem;
      }
    }
    ${Themed.media.xxl.min} {
      min-width: 25%;
      max-width: 25%;
    }
  `}
`

const ReportOverlay = styled.div<{ hasSelected: boolean }>`
  //position: absolute;
  display: flex;

  z-index: 2;

  //width: 100%;
  min-height: 100%;

  background-color: ${({ theme }) => theme.colors.tertiary.value};
  box-shadow: 0 0 4px 2px gray;

  transition: 300ms cubic-bezier(.23,1,.32,1);
  transition-property: transform;

  transform: translateX(calc(100% + 4px)); // 4px to hide box shadow
  ${Themed.media.md.max} {
    transform: translateY(calc(100% + 4px + 1rem)); // 4px to hide box shadow, 1rem for parent padding
  }
  
  transform-origin: right center;
  
  overflow: hidden;

  ${({ hasSelected }) => hasSelected && css`
    transform: translateX(0);
    ${Themed.media.md.max} {
      transform: translateY(0);
    }
  `}

  ${Themed.media.lg.min} {
    ${UiLevel.Header}, ${UiLevel.Content} {
      padding-left: 2rem;
    }
  }
  ${Themed.media.xl.min} {
    width: calc(65% + 4rem);
  }
  ${Themed.media.xxl.min} {
    width: calc(75% + 4rem);
  }
`
