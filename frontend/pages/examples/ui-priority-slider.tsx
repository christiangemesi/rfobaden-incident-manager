import React, { useState } from 'react'
import UiPrioritySlider from '@/components/Ui/PrioritySlider/UiPrioritySlider'
import Priority from '@/models/Priority'

/**
 * Example to demonstrate the use of a {@link UiPrioritySlider}.
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