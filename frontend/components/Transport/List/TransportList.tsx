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

interface Props extends StyledProps {
  incident: Incident
  transports: readonly Transport[]
  selected?: Transport | null,
  onSelect?: (report: Transport) => void
}

const TransportList: React.VFC<Props> = ({
  incident,
  transports: transports,
  selected = null,
  onSelect: handleSelect,
  style,
  className,
}) => {
  const canListBeSmall = useBreakpoint(() => ({
    xs: false,
    xl: true,
  }))
  return (
    <ListContainer hasSelected={selected !== null} style={style} className={className}>
      <UiModal isFull>
        <UiModal.Activator>{({ open }) => (
          <UiCreateButton onClick={open} title="Transport erfassen">
            <UiIcon.CreateAction size={1.5} />
          </UiCreateButton>
        )}</UiModal.Activator>
        <UiModal.Body>{({ close }) => (
          <React.Fragment>
            <UiTitle level={1} isCentered>
              Meldung erfassen
            </UiTitle>
            <TransportForm incident={incident} onSave={handleSelect} onClose={close} />
          </React.Fragment>
        )}</UiModal.Body>
      </UiModal>

      <UiList>
        {transports.map((transport) => (
          <TransportListItem
            key={transport.id}
            transport={transport}
            isActive={selected?.id === transport.id}
            isSmall={canListBeSmall && selected !== null}
            onClick={handleSelect}
          />
        ))}
      </UiList>
    </ListContainer>
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