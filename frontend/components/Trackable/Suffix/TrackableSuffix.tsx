import Trackable from '@/models/Trackable'
import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import { Themed } from '@/theme'

interface Props<T extends Trackable> {
  /**
   * Makes the date labels smaller.
   */
  isSmall: boolean

  /**
   * The {@link Trackable trackable entity}.
   */
  trackable: T

  /**
   * Additional content.
   */
  children: ReactNode
}

/**
 * `TrackableSuffix` is a component that displays the date of an {@link Trackable entity}.
 */
const TrackableSuffix = <T extends Trackable>({
  isSmall,
  trackable,
  children,
}: Props<T>): JSX.Element => {
  return (
    <SuffixList isSmall={isSmall}>
      <SuffixDate hasEnd={trackable.endsAt != null}>
        <UiDateLabel start={trackable.startsAt ?? trackable.createdAt} end={trackable.endsAt} />
      </SuffixDate>
      {children}
    </SuffixList>
  )
}
export default TrackableSuffix

const SuffixDate = styled.div<{ hasEnd: boolean }>`
  ${Themed.media.sm.max} {
    display: none;
  }

  > span {
    ${Themed.media.md.max} {
      ${({ hasEnd }) => hasEnd && css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
      `}
    }
  }
`

const SuffixList = styled.div<{ isSmall: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 1.5rem;
  white-space: nowrap;

  transition: 150ms ease-out;
  transition-property: column-gap;

  ${({ isSmall }) => isSmall && css`
    column-gap: 1rem;
    
    > ${SuffixDate} {
      display: none;
    }
  `}
`