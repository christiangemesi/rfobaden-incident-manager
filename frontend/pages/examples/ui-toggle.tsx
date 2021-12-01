import React, { useState } from 'react'
import UiToggle from '@/components/Ui/Toggle/UiToggle'



const UiToggleExample: React.VFC = () => {
  const [value, setValue] = useState(false)
  return (
    <div>
      <UiToggle value={value} onChange={setValue} label = "test" errors={['1','2']} />
      <UiToggle value={value} onChange={setValue} label = "Apples are great" errors={['I am an error!','with multiple',' arguments','in Array']} />
      <UiToggle value={value} onChange={setValue} label = "I am good at programming" errors={['Nothing','to','judge']} />
    </div>
  )
}
export default UiToggleExample