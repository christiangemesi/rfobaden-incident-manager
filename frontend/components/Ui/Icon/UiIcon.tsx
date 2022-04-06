import Icon from '@mdi/react'
import React from 'react'
import styled from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import {
  mdiAccountCircle,
  mdiAccountMultiple,
  mdiAlertCircleOutline,
  mdiCalendar,
  mdiCarMultiple,
  mdiCheck,
  mdiCheckboxBlankOutline,
  mdiCheckboxMarked,
  mdiCircleSmall,
  mdiClipboardTextOutline,
  mdiClockOutline,
  mdiClose,
  mdiDelete,
  mdiDotsHorizontal,
  mdiFire,
  mdiImageFilterHdr,
  mdiKey,
  mdiLoading,
  mdiLockReset,
  mdiLoginVariant,
  mdiLogoutVariant,
  mdiMap,
  mdiMapMarker,
  mdiMenu,
  mdiMonitorEye,
  mdiOfficeBuilding,
  mdiPaperclip,
  mdiPencil,
  mdiPlus,
  mdiPrinter,
  mdiSortAlphabeticalAscending,
  mdiSortAlphabeticalDescending,
  mdiUpload,
  mdiFormatListBulleted,
} from '@mdi/js'


interface NamedIconProps extends StyledProps {
  /**
   * Size multiplier.
   * Default is `1`.
   */
  size?: number

  /**
   * Spin the icon.
   */
  isSpinner?: boolean

  /**
   * HTML title attribute.
   */
  title?: string
}

interface Props extends NamedIconProps {
  path: string
}

const UiIcon: React.VFC<Props> = ({
  path,
  size = 1,
  isSpinner = false,
  title,
  className,
  style,
}) => {
  return (
    <Container
      title={title}
      className={className}
      style={style}
    >
      <StyledIcon
        path={path}
        spin={isSpinner}
        $size={size}
      />
    </Container>
  )
}

const Container = styled.span`
  line-height: 0;
`

const StyledIcon = styled(Icon)<{ $size: number }>`
  --size: ${({ $size }) => $size};
  
  width: calc(var(--size) * 24px);
  height: calc(var(--size) * 24px);
`

const StyledUiIcon = styled(UiIcon)``

const makeNamedIcon = (path: string, defaultProps: Partial<Props> = {}) => {
  // eslint-disable-next-line react/display-name
  return styled((props: NamedIconProps) => (
    <StyledUiIcon {...defaultProps} {...props} path={path} />
  ))``
}

const pathPriorityHigh = 'M 12 2 C 6.46 2 2 6.46 2 12 C 2 17.54 6.46 22 12 22 C 17.54 22 22 17.54 22 12 C 22 6.46 17.54 2 12 2 z M 12 7.5644531 C 12.228941 7.5645001 12.450935 7.6430944 12.628906 7.7871094 L 15.390625 10.029297 L 15.628906 10.222656 C 16.05755 10.570602 16.123121 11.200087 15.775391 11.628906 C 15.427445 12.05755 14.797959 12.123122 14.369141 11.775391 L 11.998047 9.8515625 L 9.6308594 11.775391 C 9.2020408 12.123122 8.5725553 12.05755 8.2246094 11.628906 C 7.8768786 11.200088 7.9424503 10.570602 8.3710938 10.222656 L 11.369141 7.7871094 C 11.547632 7.6426722 11.770389 7.5640523 12 7.5644531 z M 12 12 C 12.228941 12.000047 12.450935 12.078641 12.628906 12.222656 L 15.628906 14.658203 C 16.05755 15.006149 16.123122 15.635634 15.775391 16.064453 C 15.427445 16.493097 14.797959 16.558668 14.369141 16.210938 L 11.998047 14.287109 L 9.6308594 16.210938 C 9.2020408 16.558669 8.5725553 16.493097 8.2246094 16.064453 C 7.8768783 15.635635 7.9424499 15.006149 8.3710938 14.658203 L 11.369141 12.222656 C 11.547632 12.07822 11.770389 11.999599 12 12 z '
const pathPriorityMedium = 'M 12 2 C 6.46 2 2 6.46 2 12 C 2 17.54 6.46 22 12 22 C 17.54 22 22 17.54 22 12 C 22 6.46 17.54 2 12 2 z M 9 9 L 15 9 A 1 1 0 0 1 16 10 A 1 1 0 0 1 15 11 L 9 11 A 1 1 0 0 1 8 10 A 1 1 0 0 1 9 9 z M 9 13 L 15 13 A 1 1 0 0 1 16 14 A 1 1 0 0 1 15 15 L 9 15 A 1 1 0 0 1 8 14 A 1 1 0 0 1 9 13 z '
const pathPriorityLow = 'M 12 2 C 6.46 2 2 6.46 2 12 C 2 17.54 6.46 22 12 22 C 17.54 22 22 17.54 22 12 C 22 6.46 17.54 2 12 2 z M 8.8964844 7.5703125 A 1 1 0 0 1 9.6308594 7.7890625 L 11.998047 9.7128906 L 14.369141 7.7890625 A 1 1 0 0 1 15.775391 7.9355469 A 1 1 0 0 1 15.628906 9.3417969 L 12.628906 11.777344 A 1.0001 1.0001 0 0 1 12 12 A 1.0001 1.0001 0 0 1 11.369141 11.777344 L 8.3710938 9.3417969 A 1 1 0 0 1 8.2246094 7.9355469 A 1 1 0 0 1 8.8964844 7.5703125 z M 8.8964844 12.005859 A 1 1 0 0 1 9.6308594 12.224609 L 11.998047 14.148438 L 14.369141 12.224609 A 1 1 0 0 1 15.775391 12.371094 A 1 1 0 0 1 15.628906 13.777344 L 12.628906 16.212891 A 1.0001 1.0001 0 0 1 12 16.435547 A 1.0001 1.0001 0 0 1 11.369141 16.212891 L 8.3710938 13.777344 A 1 1 0 0 1 8.2246094 12.371094 A 1 1 0 0 1 8.8964844 12.005859 z '

// eslint-disable-next-line import/no-anonymous-default-export
export default Object.assign(StyledUiIcon, {
  Empty: makeNamedIcon(''),
  KeyMessage: makeNamedIcon(mdiKey),
  LocationRelevancy: makeNamedIcon(mdiImageFilterHdr),
  Attachments: makeNamedIcon(mdiPaperclip),
  CreateAction: makeNamedIcon(mdiPlus),
  EditAction: makeNamedIcon(mdiPencil),
  DeleteAction: makeNamedIcon(mdiDelete),
  PrintAction: makeNamedIcon(mdiPrinter),
  SubmitAction: makeNamedIcon(mdiCheck),
  CancelAction: makeNamedIcon(mdiClose),
  CheckboxActive: makeNamedIcon(mdiCheckboxBlankOutline),
  CheckboxInactive: makeNamedIcon(mdiCheckboxMarked),
  PriorityHigh: makeNamedIcon(pathPriorityHigh, { title: 'hohe Priorität' }),
  PriorityMedium: makeNamedIcon(pathPriorityMedium, { title: 'mittlere Priorität' }),
  PriorityLow: makeNamedIcon(pathPriorityLow, { title: 'tiefe Priorität' }),
  Menu: makeNamedIcon(mdiMenu),
  Organization: makeNamedIcon(mdiOfficeBuilding),
  Location: makeNamedIcon(mdiMapMarker),
  Map: makeNamedIcon(mdiMap),
  UserInCircle: makeNamedIcon(mdiAccountCircle),
  UserManagement: makeNamedIcon(mdiAccountMultiple),
  IncidentManagement: makeNamedIcon(mdiFire),
  AlertCircle: makeNamedIcon(mdiAlertCircleOutline),
  Calendar: makeNamedIcon(mdiCalendar),
  Changelog: makeNamedIcon(mdiClipboardTextOutline),
  Transport: makeNamedIcon(mdiCarMultiple),
  Monitoring: makeNamedIcon(mdiMonitorEye),
  Login: makeNamedIcon(mdiLoginVariant),
  Logout: makeNamedIcon(mdiLogoutVariant),
  Loader: makeNamedIcon(mdiLoading),
  More: makeNamedIcon(mdiDotsHorizontal),
  Clock: makeNamedIcon(mdiClockOutline),
  Dot: makeNamedIcon(mdiCircleSmall),
  SortAsc: makeNamedIcon(mdiSortAlphabeticalAscending),
  SortDesc: makeNamedIcon(mdiSortAlphabeticalDescending),
  ResetPassword: makeNamedIcon(mdiLockReset),
  Upload: makeNamedIcon(mdiUpload),
  AssignedList: makeNamedIcon(mdiFormatListBulleted),
})
