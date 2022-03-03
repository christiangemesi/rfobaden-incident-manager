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
    <StyledListItem {...props} isClosed={isClosed} isSmall={isSmall}>
      <LeftSide>
        {(isSmall && !isSmall) ? (
          <PriorityDot color={priorityColor} />

        // <PriorityBar color={priorityColor}>
        //   <PriorityBarItem color="error" isActive={priority === Priority.HIGH} />
        //   <PriorityBarItem color="warning" isActive={priority === Priority.MEDIUM} />
        //   <PriorityBarItem color="success" isActive={priority === Priority.LOW} />
        // </PriorityBar>
        ) : (
          <PriorityContainer color={priorityColor} isSmall={isSmall}>
            <PriorityIcon size={isSmall ? 1 : 1.5} />
          </PriorityContainer>
        )}
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
  ${({ isClosed }) => isClosed && css`
    filter: grayscale(0.8) brightness(0.8);
    opacity: 0.75;

    &:hover {
      filter: grayscale(0.8) brightness(0.8);
      opacity: 1;
    }
  `}
  
  ${({ isSmall }) => isSmall && css`
    // For priority bars:
    // padding-left: 2rem;
    
    padding-left: 0.5rem;
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
  margin-right: ${({ isSmall }) => isSmall ? '0.5rem' : '1rem'};
  color: ${({ theme, color }) => theme.colors[color].value};
`

const PriorityDot = styled.div<{ color: ColorName }>`
  width: 0.75rem;
  height: 0.75rem;
  margin-right: 1rem;
  border-radius: 100%;
  background-color: ${({ theme, color }) => theme.colors[color].value};
`

//
// const PriorityBar = styled.ul<{ color: ColorName }>`
//   position: absolute;
//   left: 0;
//   top: 0;
//
//   height: 100%;
//   width: calc(19.3px - 4px);
//
//   display: flex;
//   flex-direction: column;
//
//   border: 4px solid ${({ theme, color }) => theme.colors[color].value};;
//   border-top: none;
//   border-bottom: none;
//   border-left: none;
// `
//
// const PriorityBarItem = styled.li<{ color: ColorName, isActive: boolean }>`
//   height: calc(100% / 3);
//   width: 100%;
//
//   // background-color: ${({ theme }) => theme.colors.grey.value};
//   ${({ theme, color, isActive }) => isActive && css`
//     background-color: ${theme.colors[color].value};
//   `}
//
// `