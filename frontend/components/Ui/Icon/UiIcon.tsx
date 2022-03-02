import Icon from '@mdi/react'
import React from 'react'
import styled from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import {
  mdiAccountCircle,
  mdiAccountMultiple,
  mdiAlertCircleOutline,
  mdiCalendar,
  mdiCheck,
  mdiCheckboxBlankOutline,
  mdiCheckboxMarked,
  mdiClipboardTextOutline,
  mdiClose,
  mdiDelete,
  mdiImageFilterHdr,
  mdiKey,
  mdiLoginVariant,
  mdiLogoutVariant,
  mdiMap,
  mdiMapMarker,
  mdiMenu,
  mdiPaperclip,
  mdiPencil,
  mdiPlus,
  mdiPrinter,
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
}

interface Props extends NamedIconProps {
  path: string
}

const UiIcon: React.VFC<Props> = ({
  path,
  size = 1,
  isSpinner = false,
  className,
  style,
}) => {
  return (
    <Icon
      path={path}
      size={`${24 * size}px`}
      spin={isSpinner}
      className={className}
      style={style}
    />
  )
}

const StyledUiIcon = styled(UiIcon)``

const makeNamedIcon = (path: string) => {
  // eslint-disable-next-line react/display-name
  return styled((props: NamedIconProps) => (
    <StyledUiIcon {...props} path={path} />
  ))``
}

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
  PriorityHigh: makeNamedIcon('M 12 2 C 6.46 2 2 6.46 2 12 C 2 17.54 6.46 22 12 22 C 17.54 22 22 17.54 22 12 C 22 6.46 17.54 2 12 2 z M 12 3.9707031 C 16.41 3.9707031 20.029297 7.59 20.029297 12 C 20.029297 16.41 16.41 20.029297 12 20.029297 C 7.59 20.029297 3.9707031 16.41 3.9707031 12 C 3.9707031 7.59 7.59 3.9707031 12 3.9707031 z M 12 7.1308594 A 1.0001 1.0001 0 0 0 11.369141 7.3535156 L 8.3710938 9.7890625 A 1 1 0 0 0 8.2246094 11.195312 A 1 1 0 0 0 9.6308594 11.341797 L 11.998047 9.4179688 L 14.369141 11.341797 A 1 1 0 0 0 15.775391 11.195312 A 1 1 0 0 0 15.628906 9.7890625 L 12.628906 7.3535156 A 1.0001 1.0001 0 0 0 12 7.1308594 z M 12 11.566406 A 1.0001 1.0001 0 0 0 11.369141 11.789062 L 8.3710938 14.224609 A 1 1 0 0 0 8.2246094 15.630859 A 1 1 0 0 0 9.6308594 15.777344 L 11.998047 13.853516 L 14.369141 15.777344 A 1 1 0 0 0 15.775391 15.630859 A 1 1 0 0 0 15.628906 14.224609 L 12.628906 11.789062 A 1.0001 1.0001 0 0 0 12 11.566406 z '),
  PriorityMedium: makeNamedIcon('M 12 2 C 6.46 2 2 6.46 2 12 C 2 17.54 6.46 22 12 22 C 17.54 22 22 17.54 22 12 C 22 6.46 17.54 2 12 2 z M 12 3.9707031 C 16.41 3.9707031 20.029297 7.59 20.029297 12 C 20.029297 16.41 16.41 20.029297 12 20.029297 C 7.59 20.029297 3.9707031 16.41 3.9707031 12 C 3.9707031 7.59 7.59 3.9707031 12 3.9707031 z M 9 9 A 1 1 0 0 0 8 10 A 1 1 0 0 0 9 11 L 15 11 A 1 1 0 0 0 16 10 A 1 1 0 0 0 15 9 L 9 9 z M 9 13 A 1 1 0 0 0 8 14 A 1 1 0 0 0 9 15 L 15 15 A 1 1 0 0 0 16 14 A 1 1 0 0 0 15 13 L 9 13 z '),
  PriorityLow: makeNamedIcon('M 12 2 C 6.46 2 2 6.46 2 12 C 2 17.54 6.46 22 12 22 C 17.54 22 22 17.54 22 12 C 22 6.46 17.54 2 12 2 z M 12 3.9707031 C 16.41 3.9707031 20.029297 7.59 20.029297 12 C 20.029297 16.41 16.41 20.029297 12 20.029297 C 7.59 20.029297 3.9707031 16.41 3.9707031 12 C 3.9707031 7.59 7.59 3.9707031 12 3.9707031 z M 8.8964844 8.0058594 A 1 1 0 0 0 8.2246094 8.3710938 A 1 1 0 0 0 8.3710938 9.7773438 L 11.369141 12.212891 A 1.0001 1.0001 0 0 0 12 12.435547 A 1.0001 1.0001 0 0 0 12.628906 12.212891 L 15.628906 9.7773438 A 1 1 0 0 0 15.775391 8.3710938 A 1 1 0 0 0 14.369141 8.2246094 L 11.998047 10.148438 L 9.6308594 8.2246094 A 1 1 0 0 0 8.8964844 8.0058594 z M 8.8964844 12.441406 A 1 1 0 0 0 8.2246094 12.806641 A 1 1 0 0 0 8.3710938 14.212891 L 11.369141 16.648438 A 1.0001 1.0001 0 0 0 12 16.871094 A 1.0001 1.0001 0 0 0 12.628906 16.648438 L 15.628906 14.212891 A 1 1 0 0 0 15.775391 12.806641 A 1 1 0 0 0 14.369141 12.660156 L 11.998047 14.583984 L 9.6308594 12.660156 A 1 1 0 0 0 8.8964844 12.441406 z '),
  Menu: makeNamedIcon(mdiMenu),
  Organization: makeNamedIcon(mdiAccountMultiple),
  Location: makeNamedIcon(mdiMapMarker),
  Map: makeNamedIcon(mdiMap),
  UserInCircle: makeNamedIcon(mdiAccountCircle),
  AlertCircle: makeNamedIcon(mdiAlertCircleOutline),
  Calendar: makeNamedIcon(mdiCalendar),
  Changelog: makeNamedIcon(mdiClipboardTextOutline),
  Login: makeNamedIcon(mdiLoginVariant),
  Logout: makeNamedIcon(mdiLogoutVariant),
})
