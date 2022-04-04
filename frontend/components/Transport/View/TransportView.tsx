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

        <UiDescription description={transport.description} />

        <UiGrid align="start" gap={1}>
          <UiGrid>
            <UiGrid.Col size={4}>
              <LabeledValue>
                <UiTitle level={6}>Fahrezeug:</UiTitle>
                <span>{transport.vehicle}</span>
              </LabeledValue>
            </UiGrid.Col>
            <UiGrid.Col size={4}>
              <LabeledValue>
                <UiTitle level={6}>Ahänger:</UiTitle>
                <span>{transport.trailer}</span>
              </LabeledValue>
            </UiGrid.Col>
          </UiGrid>
          <UiGrid>
            <UiGrid.Col size={4}>
              <LabeledValue>
                <UiTitle level={6}>Abfahrtsort:</UiTitle>
                <span>{transport.sourcePlace}</span>
              </LabeledValue>
            </UiGrid.Col>
            <UiGrid.Col size={4}>
              <LabeledValue>
                <UiTitle level={6}>Ankunftsort:</UiTitle>
                <span>{transport.destinationPlace}</span>
              </LabeledValue>
            </UiGrid.Col>
          </UiGrid>
          <UiGrid>
            <UiGrid.Col size={4}>
              <LabeledValue>
                <UiTitle level={6}>Fahrer:</UiTitle>
                <span>{transport.driver}</span>
              </LabeledValue>
            </UiGrid.Col>
          </UiGrid>
        </UiGrid>
      </UiLevel.Header>
    </UiLevel>
  )
}
export default TransportView

const LabeledValue = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
`
