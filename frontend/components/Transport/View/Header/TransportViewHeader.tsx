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

interface Props {
  incident: Incident
  transport: Transport
  onClose?: () => void
}

const TransportViewHeader: React.VFC<Props> = ({ incident, transport, onClose: handleClose }) => {
  return (
    <React.Fragment>
      <UiGrid justify="space-between" align="start" gap={1} style={{ flexWrap: 'nowrap' }}>
        <div>
          <TransportInfo transport={transport} />
          <UiTitle level={3}>
            {transport.title}
          </UiTitle>
        </div>
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
              <span>{transport.vehicle ?? '-'}</span>
            </td>
          </tr>
          <tr>
            <th>
              <UiTitle level={6}>Anhänger:</UiTitle>
            </th>
            <td>
              <span>{transport.trailer ?? '-'}</span>
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
    </React.Fragment>
  )
}
export default TransportViewHeader


const InfoTable = styled.table`
  table-layout: fixed;
  text-align: left;
  th {
    width: 10rem;
  }
`