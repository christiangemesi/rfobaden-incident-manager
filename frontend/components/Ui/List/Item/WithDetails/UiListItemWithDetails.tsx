import React, { EventHandler, MouseEvent, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import Priority from '@/models/Priority'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import { ColorName } from '@/theme'
import { StyledProps } from '@/utils/helpers/StyleHelper'

interface Props extends StyledProps {
  priority: Priority
  title: string
  user: string
  color?: ColorName
  isClosed?: boolean
  children: ReactNode
  onClick?: EventHandler<MouseEvent>
}

const UiListItemWithDetails: React.VFC<Props> = ({
  priority,
  title,
  user,
  color,
  className,
  style,
  isClosed = false,
  children,
  onClick: handleClick,
}: Props) => {
  let priorityIcon = <UiIcon.PriorityMedium />

  if (priority === Priority.HIGH) {
    priorityIcon = <UiIcon.PriorityHigh />
  } else if (priority === Priority.LOW) {
    priorityIcon = <UiIcon.PriorityLow />
  }

  return (
    <StyledListItem isClosed={isClosed} color={color} style={style} className={className} onClick={handleClick}>
      <CenterBox>
        <StyledPriority>
          {priorityIcon}
        </StyledPriority>
        <div>
          <UiTitle level={5}>
            {title}
          </UiTitle>
          {user}
        </div>
      </CenterBox>
      <CenterBox>
        {children}
      </CenterBox>
    </StyledListItem>
  )
}
export default styled(UiListItemWithDetails)``

const StyledListItem = styled(UiListItem)<{ isClosed: boolean }>`
  transition: 150ms ease-in;
  transition-property: filter, opacity, color, background-color;
  
  ${({ isClosed }) => isClosed && css`
    filter: grayscale(0.75);
    opacity: 0.75;
    
    &:hover {
      filter: grayscale(0.75);
      opacity: 1;
    }
  `}
`

const StyledPriority = styled.div`
  display: inline-flex;
  margin-right: 1rem;
`

const CenterBox = styled.div`
  display: flex;
  align-items: center;
`
