import React, { useMemo } from 'react'
import styled, { css } from 'styled-components'
import Priority from '@/models/Priority'
import UiListItem, { Props as UiListItemProps } from '@/components/Ui/List/Item/UiListItem'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import { ColorName } from '@/theme'

interface Props extends UiListItemProps {
  priority: Priority
  title: string
  user: string
  isClosed?: boolean
  isSmall?: boolean
}

const UiListItemWithDetails: React.VFC<Props> = ({
  priority,
  title,
  user,
  isClosed = false,
  isSmall = false,
  children,
  ...props
}: Props) => {
  const [PriorityIcon, priorityColor] = useMemo(() => {
    switch (priority) {
    case Priority.HIGH:
      return [UiIcon.PriorityHigh, 'error' as const]
    case Priority.MEDIUM:
      return [UiIcon.PriorityMedium, 'warning' as const]
    case Priority.LOW:
      return [UiIcon.PriorityLow, 'success' as const]
    }
  }, [priority])

  return (
    <StyledListItem {...props} isClosed={isClosed} isSmall={isSmall} title={title}>
      <LeftSide>
        <PriorityContainer color={priorityColor} isSmall={isSmall}>
          <PriorityIcon size={1.5} />
        </PriorityContainer>
        <TextContent>
          <ItemTitle level={5}>
            {title}
          </ItemTitle>
          {user}
        </TextContent>
      </LeftSide>
      <RightSide>
        {children}
      </RightSide>
    </StyledListItem>
  )
}
export default styled(UiListItemWithDetails)``

const StyledListItem = styled(UiListItem)<{ isClosed: boolean, isSmall: boolean }>`
  padding-left: 0;
  transition-property: inherit, padding;
  
  ${({ isClosed }) => isClosed && css`
    filter: grayscale(0.8) brightness(0.8);
    opacity: 0.75;

    &:hover {
      filter: grayscale(0.8) brightness(0.8);
      opacity: 1;
    }
  `}
`

const LeftSide = styled.div`
  display: flex;
  align-items: center;
  
  min-width: 0; // Causes the children of this element to not be able to overflow.
`

const RightSide = styled.div`
  display: flex;
  align-items: center;
  
  flex: 0 0 auto;
  width: auto;
  max-width: 100%;
`

const TextContent = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const ItemTitle = styled(UiTitle)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const PriorityContainer = styled.div<{ color: ColorName, isSmall: boolean }>`
  display: inline-flex;
  margin: ${({ isSmall }) => isSmall ? '0 0.5rem' : '0 1rem'};
  color: ${({ theme, color }) => theme.colors[color].value};

  transition: 150ms ease-out;
  transition-property: margin;
`
