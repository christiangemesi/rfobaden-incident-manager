import React from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiTextWithIcon from '@/components/Ui/TextWithIcon/UiTextWithIcon'

/**
 * `UiTextWithInputExample` is an example page for the {@link UiTextWithInput} component.
 */
const UiTextWithInputExample: React.VFC = () => {
  return (
    <div>
      {/* Default text with icon */}
      <UiTextWithIcon text="Christian">
        <UiIcon.DeleteAction />
      </UiTextWithIcon>
      <br />

      {/* Text with icon two times without line break */}
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
