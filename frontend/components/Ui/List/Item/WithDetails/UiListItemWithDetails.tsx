import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import Priority from '@/models/Priority'
import UiListItem, { Props as UiListItemProps } from '@/components/Ui/List/Item/UiListItem'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiPriority from '@/components/Ui/Priority/UiPriority'

interface Props extends UiListItemProps {
  priority: Priority
  title: string
  user: string
  body?: ReactNode
  caption?: ReactNode
  isClosed?: boolean
  isSmall?: boolean
  isTitleSwitched?: boolean
}

const UiListItemWithDetails: React.VFC<Props> = ({
  priority,
  title,
  user,
  body = null,
  caption = null,
  isClosed = false,
  isSmall = false,
  isTitleSwitched = false,
  children,
  ...props
}: Props) => {

  return (
    <StyledListItem {...props} isClosed={isClosed} title={title}>
      <LeftSide>
        <LeftPriority priority={priority} isSmall={isSmall} />
        <TextContent isTitleSwitched={isTitleSwitched}>
          {caption && (
            <ItemCaption>
              {caption}
            </ItemCaption>
          )}
          <ItemTitle level={5}>
            {title}
          </ItemTitle>
          {user}
        </TextContent>
      </LeftSide>
      <RightSide>
        {children}
      </RightSide>
      {body && (
        <BottomSide isSmall={isSmall}>
          {body}
        </BottomSide>
      )}
    </StyledListItem>
  )
}
export default styled(UiListItemWithDetails)``

const StyledListItem = styled(UiListItem)<{ isClosed: boolean }>`
  padding-left: 0;
  transition-property: inherit, padding;
  flex-wrap: wrap;

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

  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;

  min-width: 0; // Causes the children of this element to not be able to overflow.
`

const RightSide = styled.div`
  display: flex;
  align-items: center;

  flex: 0 0 auto;
  width: auto;
  max-width: 100%;
`

const BottomSide = styled.div<{ isSmall: boolean }>`
  display: block;
  flex: 1 0 100%;
  width: 100%;
  max-width: 100%;
  padding-top: 1rem;
  padding-left: calc(${({ isSmall }) => isSmall ? '0.5rem' : '1rem'} * 2 + 36px);
`

const TextContent = styled.div<{ isTitleSwitched: boolean }>`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  ${({ isTitleSwitched }) => isTitleSwitched && css`
    display: flex;
    flex-direction: column-reverse;
  `}
`

const ItemTitle = styled(UiTitle)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const ItemCaption = styled.div`
  margin-right: 0.5rem;
`

const LeftPriority = styled(UiPriority)`
  margin: ${({ isSmall }) => isSmall ? '0 0.5rem' : '0 1rem'};
  transition: 150ms ease-out;
  transition-property: margin;
`