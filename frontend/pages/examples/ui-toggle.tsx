import React, { useState } from 'react'
import Toggle from '@/components/Ui/Toggle/Toggle'

const handleClick = () => {
  console.log('Clicked...')
}

const UiToggleExample: React.VFC = () => {
  return (
    <div>
      <Toggle onClick={handleClick} />
    </div>
  )
}
export default UiToggleExample