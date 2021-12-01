import React from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiTextWithIcon from '@/components/Ui/TextWithIcon/UiTextWithIcon '

const UiTextWithInputExample: React.VFC = () => {
  return (
    <div>
      <UiTextWithIcon text="Christian">
        <UiIcon.DeleteAction />
      </UiTextWithIcon>
      <UiTextWithIcon text="Daniel">
        <UiIcon.PriorityHigh />
      </UiTextWithIcon>
      <UiTextWithIcon text="Andri">
        <UiIcon.PriorityLow />
      </UiTextWithIcon>
    </div>
  )
}

export default UiTextWithInputExample