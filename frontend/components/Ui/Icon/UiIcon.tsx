import Icon from '@mdi/react'
import React from 'react'
import {
  mdiArrowDownBoldHexagonOutline,
  mdiArrowUpBoldHexagonOutline, mdiCheck,
  mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiClose,
  mdiDelete,
  mdiFlash, mdiHexagonOutline,
  mdiImageFilterHdr, mdiMenu,
  mdiPaperclip,
  mdiPencil,
  mdiPlus,
  mdiPrinter,
  mdiAccountMultiple,
} from '@mdi/js'

interface NamedIconProps {
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
}) => {
  return (
    <Icon
      path={path}
      size={`${24 * size}px`}
      spin={isSpinner}
    />
  )
}

const makeNamedIcon = (path: string): React.VFC<NamedIconProps> => {
  // eslint-disable-next-line react/display-name
  return (props) => (
    <UiIcon {...props} path={path} />
  )
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  KeyMessage: makeNamedIcon(mdiFlash),
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
  PriorityHigh: makeNamedIcon(mdiArrowUpBoldHexagonOutline),
  PriorityMedium: makeNamedIcon(mdiHexagonOutline),
  PriorityLow: makeNamedIcon(mdiArrowDownBoldHexagonOutline),
  Menu: makeNamedIcon(mdiMenu),
  Organization: makeNamedIcon(mdiAccountMultiple),
  Empty: makeNamedIcon(''),
}
