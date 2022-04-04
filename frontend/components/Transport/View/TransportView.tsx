import Transport from '@/models/Transport'
import React from 'react'
import styled from 'styled-components'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiIconButtonGroup from '@/components/Ui/Icon/Button/Group/UiIconButtonGroup'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiDescription from '@/components/Ui/Description/UiDescription'
import TransportInfo from '@/components/Transport/Info/TransportInfo'
import Incident from '@/models/Incident'
import UiLevel from '@/components/Ui/Level/UiLevel'
import TransportActions from '@/components/Transport/Actions/TransportActions'
import { Themed } from '@/theme'

interface Props {
  incident: Incident
  transport: Transport
  onClose?: () => void
}

const TransportView: React.VFC<Props> = ({ incident, transport, onClose: handleCloseView }) => {
  return (
    <UiLevel>
      <UiLevel.Header>
        <UiGrid justify="space-between" align="start" gap={1} style={{ flexWrap: 'nowrap' }}>
          <div>
            <TransportInfo transport={transport} />
            <UiTitle level={3}>
              {transport.title}
            </UiTitle>
          </div>
          <UiIconButtonGroup>
            <TransportActions incident={incident} transport={transport} onDelete={handleCloseView} />

            <UiIconButton onClick={handleCloseView}>
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
                <span>{transport.sourcePlace ?? '-'}</span>
              </td>
            </tr>
            <tr>
              <th>
                <UiTitle level={6}>Ankunftsort:</UiTitle>
              </th>
              <td>
                <span>{transport.destinationPlace ?? '-'}</span>
              </td>
            </tr>
          </tbody>
        </InfoTable>

        <UiDescription description={transport.description} />
      </UiLevel.Header>
    </UiLevel>
  )
}
export default TransportView

const InfoTable = styled.table`
  table-layout: fixed;
  text-align: left;
  th {
    width: 10rem;
  }
  
`
