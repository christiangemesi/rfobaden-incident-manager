import Report from '@/models/Report'
import React, { useMemo } from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import TrackableListItem, { Props as TrackableListItemProps } from '@/components/Trackable/List/Item/TrackableListItem'

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
      <UiGrid direction={isSmall ? 'column' : undefined} gapH={1}>
        {report.isKeyReport ? (
          <UiIcon.KeyMessage size={isSmall ? ICON_MULTIPLIER_SMALL : undefined} />
        ) : defaultIcon}
        {report.isLocationRelevantReport ? (
          <UiIcon.LocationRelevancy size={isSmall ? ICON_MULTIPLIER_SMALL : undefined} />
        ) : defaultIcon}
      </UiGrid>

      <div>
        {report.closedTaskIds.length}/{report.taskIds.length}
      </div>
    </TrackableListItem>
  )
}
export default ReportListItem

const ICON_MULTIPLIER_SMALL = 0.75
