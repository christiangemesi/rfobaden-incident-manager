import React from 'react'
import Transport from '@/models/Transport'
import UiList from '@/components/Ui/List/UiList'
import TransportListItem from '@/components/Transport/List/Item/TransportListItem'
import styled, { css } from 'styled-components'
import useBreakpoint from '@/utils/hooks/useBreakpoints'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiTitle from '@/components/Ui/Title/UiTitle'
import TransportForm from '@/components/Transport/Form/TransportForm'
import Incident from '@/models/Incident'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiCreateButton from '@/components/Ui/Button/UiCreateButton'
import { Themed } from '@/theme'
import TrackableList from '@/components/Trackable/List/TrackableList'

interface Props extends StyledProps {
  incident: Incident
  transports: readonly Transport[]
  selected?: Transport | null,
  onSelect?: (report: Transport) => void
}

const TransportList: React.VFC<Props> = ({
  incident,
  transports,
  ...listProps
}) => {
  return (
    <TrackableList
      {...listProps}
      records={[transports]}
      renderForm={({ save, close }) => (
        <React.Fragment>
          <UiTitle level={1} isCentered>
            Transport erfassen
          </UiTitle>
          <TransportForm incident={incident} onSave={save} onClose={close} />
        </React.Fragment>
      )}
      renderItem={({ record, ...itemProps }) => (
        <TransportListItem
          {...itemProps}
          record={record}
          isClosed={record.isClosed}
        />
      )}
    />
  )
}
export default styled(TransportList)``

const ListContainer = styled.div<{ hasSelected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  transition: 300ms cubic-bezier(0.23, 1, 0.32, 1);
  will-change: padding-right;
  transition-property: padding-right;
  ${({ hasSelected }) => hasSelected && css`
    ${Themed.media.lg.min} {
      padding-right: 2rem;
    }
  `}
`