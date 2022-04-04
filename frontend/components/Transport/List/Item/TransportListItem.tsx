import Transport, { parseTransport } from '@/models/Transport'
import React, { useCallback } from 'react'
import { useUser } from '@/stores/UserStore'
import styled, { css } from 'styled-components'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import { useUsername } from '@/models/User'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import { Themed } from '@/theme'
import TransportStore from '@/stores/TransportStore'
import UiCheckbox from '@/components/Ui/Checkbox/UiCheckbox'
import BackendService, { BackendResponse } from '@/services/BackendService'

interface Props {
  transport: Transport
  isActive: boolean
  isSmall: boolean
  onClick?: (transport: Transport) => void
}

const TransportListItem: React.VFC<Props> = ({
  transport,
  isActive,
  isSmall,
  onClick: handleClick,
}) => {
  const assignee = useUser(transport.assigneeId)
  const assigneeName = useUsername(assignee)

  const handleChange = useCallback(async () => {
    const newTransport = { ...transport, isClosed: !transport.isClosed }
    const [data, error]: BackendResponse<Transport> = await BackendService.update(
      `incidents/${transport.incidentId}/transports`,
      transport.id,
      newTransport
    )
    if (error !== null) {
      throw error
    }
    TransportStore.save(parseTransport(data))
  }, [transport])

  return (
    <Item
      isActive={isActive}
      isClosed={transport.isClosed}
      isSmall={isSmall}
      title={transport.title}
      priority={transport.priority}
      user={assigneeName ?? ''}
      onClick={handleClick && (() => handleClick(transport))}
    >
      <PrefixList isSmall={isSmall}>
        <PrefixDate>
          <UiDateLabel start={transport.startsAt ?? transport.createdAt} end={transport.endsAt} />
        </PrefixDate>
        <UiCheckbox label="" value={transport.isClosed} onChange={handleChange} />
      </PrefixList>
      <BridgeClip>
        <Bridge isActive={isActive ?? false} />
      </BridgeClip>
    </Item>
  )
}
export default TransportListItem

const Item = styled(UiListItemWithDetails)<{ isActive: boolean }>`
  ${({ isActive }) => isActive && css`
    transition-duration: 300ms;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  `}
`

const PrefixDate = styled.div`
  ${Themed.media.sm.max} {
    display: none;
  }
`

const PrefixList = styled.div<{ isSmall: boolean }>`
  display: flex;
  align-items: center;
  column-gap: 1.5rem;
  white-space: nowrap;
  
  transition: 150ms ease-out;
  transition-property: column-gap;
  
  ${({ isSmall }) => isSmall && css`
    column-gap: 1rem;
    
    ${PrefixDate} {
      display: none;
    }
  `}
`

const Bridge = styled.div<{ isActive: boolean }>`
  width: 100%;
  height: 100%;
  
  background-color: ${({ theme }) => theme.colors.secondary.value};

  transition: 300ms ease-in-out;
  transition-property: transform, background-color, box-shadow;
  transform-origin: left center;
  transform: scaleX(0);
  will-change: transform, background-color, box-shadow;
  
  ${({ isActive, theme }) => isActive && css`
    transform: scaleX(1);
    transform-origin: right center;
    
    background-color: ${theme.colors.tertiary.value};
    box-shadow: 0 0 4px 2px gray;
  `}
`

const BridgeClip = styled.div`
  position: absolute;
  left: calc(100% - 1px);
  width: calc(2rem + 1px);
  height: calc(100%);
  z-index: 3;
  
  overflow-x: clip;
  overflow-y: visible;
  
  ${Themed.media.md.max} {
    display: none;
  }
`