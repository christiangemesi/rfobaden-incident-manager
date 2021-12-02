import React, { useState } from 'react'
import UiPrioritySlider from '@/components/Ui/PrioritySlider/UiPrioritySlider'
import Priority from '@/models/Slider'

const UiPrioritySliderExample: React.VFC = () => {

  const [value, setValue] = useState(Priority.MEDIUM)

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