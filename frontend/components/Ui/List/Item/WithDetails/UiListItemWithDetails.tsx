import React, { EventHandler, MouseEvent, ReactNode } from 'react'
import styled from 'styled-components'
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
    <UiListItem onClick={handleClick} color={color} style={style} className={className}>
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
    </UiListItem>
  )
}
export default styled(UiListItemWithDetails)``

const StyledPriority = styled.div`
  display: inline-flex;
  margin-right: 1rem;
`

const CenterBox = styled.div`
  display: flex;
  align-items: center;
`
