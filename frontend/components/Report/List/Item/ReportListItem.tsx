import Report from '@/models/Report'
import React, { useMemo } from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import TrackableListItem, { Props as TrackableListItemProps } from '@/components/Trackable/List/Item/TrackableListItem'
import styled, { css } from 'styled-components'
import { Themed } from '@/theme'

type Props = Omit<TrackableListItemProps<Report>, 'children'>

const ReportListItem: React.VFC<Props> = ({
  record: report,
  isSmall,
  ...itemProps
}) => {
  const defaultIcon = useMemo(() => isSmall ? (
    <React.Fragment />
  ) : (
    <UiIcon.Empty />
  ), [isSmall])

  return (
    <TrackableListItem {...itemProps} record={report} isSmall={isSmall}>
      <IconContainer isSmall={isSmall}>
        {report.isKeyReport ? (
          <UiIcon.KeyMessage size={isSmall ? ICON_MULTIPLIER_SMALL : undefined} />
        ) : defaultIcon}
        {report.isLocationRelevantReport ? (
          <UiIcon.LocationRelevancy size={isSmall ? ICON_MULTIPLIER_SMALL : undefined} />
        ) : defaultIcon}
      </IconContainer>

      <div>
        {report.closedTaskIds.length}/{report.taskIds.length}
      </div>
    </TrackableListItem>
  )
}
export default ReportListItem

const ICON_MULTIPLIER_SMALL = 0.75

const IconContainer = styled.div<{ isSmall: boolean }>`
  display: flex;
  column-gap: 1rem;
  
  ${({ isSmall }) => isSmall && css`
    flex-direction: column;
  `}
  
  ${Themed.media.sm.max} {
    flex-direction: column;
  }
`