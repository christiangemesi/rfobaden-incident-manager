import React, { useState } from 'react'
import UiPrioritySlider from '@/components/Ui/PrioritySlider/UiPrioritySlider'
import Priority from '@/models/Priority'

/**
 * `UiPrioritySliderExample` is an example page for the {@link UiPrioritySlider} component.
 */
const UiPrioritySliderExample: React.VFC = () => {

  const [value, setValue] = useState(Priority.MEDIUM as Priority | null)

  return(
    <div>
      <UiPrioritySlider value={value} onChange={setValue} />
      <br />
      <br />
      <UiPrioritySlider value={value} onChange={setValue} errors={['Error 1','This is a long error message']} />
    </div>
  )
}

export default UiPrioritySliderExample