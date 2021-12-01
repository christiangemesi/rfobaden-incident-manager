import React from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'

import TextWithIcon from '@/components/Ui/TextWithIcon/TextWithIcon'

const UiTextWithIcon: React.VFC = () => {
  return (
    <TextWithIcon text="Christian">
      <UiIcon.DeleteAction />
    </TextWithIcon>
  )
}

export default UiTextWithIcon