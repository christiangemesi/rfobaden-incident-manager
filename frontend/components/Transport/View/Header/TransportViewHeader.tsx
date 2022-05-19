import UiGrid from '@/components/Ui/Grid/UiGrid'
import TransportInfo from '@/components/Transport/Info/TransportInfo'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiIconButtonGroup from '@/components/Ui/Icon/Button/Group/UiIconButtonGroup'
import TransportActions from '@/components/Transport/Actions/TransportActions'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiDescription from '@/components/Ui/Description/UiDescription'
import React from 'react'
import styled from 'styled-components'
import Incident from '@/models/Incident'
import Transport from '@/models/Transport'
import UiPriority from '@/components/Ui/Priority/UiPriority'
import VehicleStore, { useVehicle } from '@/stores/VehicleStore'
import { useEffectOnce } from 'react-use'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Vehicle, { parseVehicle } from '@/models/Vehicle'
import Trailer, { parseTrailer } from '@/models/Trailer'
import TrailerStore, { useTrailer } from '@/stores/TrailerStore'

interface Props {
  incident: Incident
  transport: Transport
  hasPriority?: boolean
  onClose?: () => void
}

const TransportViewHeader: React.VFC<Props> = ({
  incident,
  transport,
  hasPriority = false,
  onClose: handleClose,
}) => {

  /**
   * Load all {@link Vehicle vehicles} to get the display name of the vehicle.
   */
  useEffectOnce(() => {
    (async () => {
      // load and save all vehicles
      const [visibleVehicles, visibleVehiclesError]: BackendResponse<Vehicle[]> = await BackendService.list(
        'vehicles',
      )
      if (visibleVehiclesError !== null) {
        throw visibleVehiclesError
      }
      VehicleStore.saveAll(visibleVehicles.map(parseVehicle))

      const [visibleTrailers, visibleTrailersError]: BackendResponse<Trailer[]> = await BackendService.list(
        'trailer',
      )
      if (visibleTrailersError !== null) {
        throw visibleTrailersError
      }
      TrailerStore.saveAll(visibleTrailers.map(parseTrailer))
    })()
  })

  // prepare names of vehicle and trailer
  const vehicle = useVehicle(transport.vehicleId)?.name ?? '-'
  const trailer = useTrailer(transport.trailerId)?.name ?? '-'

  return (
    <Container>
      <UiGrid justify="space-between" align="start" gap={1} style={{ flexWrap: 'nowrap' }}>
        <TitleContainer>
          {hasPriority && (
            <UiPriority priority={transport.priority} />
          )}
          <div>
            <TransportInfo transport={transport} />
            <UiTitle level={3}>
              {transport.title}
            </UiTitle>
          </div>
        </TitleContainer>

        <UiIconButtonGroup>
          <TransportActions incident={incident} transport={transport} onDelete={handleClose} />

          <UiIconButton onClick={handleClose}>
            <UiIcon.CancelAction />
          </UiIconButton>
        </UiIconButtonGroup>
      </UiGrid>

      <InfoTable>
        <tbody>
          <tr>
            <th>
              <UiTitle level={6}>Fahrer:</UiTitle>
            </th>
            <td>
              <span>{transport.driver ?? '-'}</span>
            </td>
          </tr>
          <tr>
            <th>
              <UiTitle level={6}>Fahrzeug:</UiTitle>
            </th>
            <td>
              <span>{vehicle}</span>
            </td>
          </tr>
          <tr>
            <th>
              <UiTitle level={6}>Anhänger:</UiTitle>
            </th>
            <td>
              <span>{trailer}</span>
            </td>
          </tr>
          <tr>
            <th>
              <UiTitle level={6}>Abfahrtsort:</UiTitle>
            </th>
            <td>
              <span>{transport.pointOfDeparture ?? '-'}</span>
            </td>
          </tr>
          <tr>
            <th>
              <UiTitle level={6}>Ankunftsort:</UiTitle>
            </th>
            <td>
              <span>{transport.pointOfArrival ?? '-'}</span>
            </td>
          </tr>
        </tbody>
      </InfoTable>

      <UiDescription description={transport.description} />
    </Container>
  )
}
export default TransportViewHeader

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const InfoTable = styled.table`
  table-layout: fixed;
  text-align: left;

  th {
    width: 10rem;
  }
`
