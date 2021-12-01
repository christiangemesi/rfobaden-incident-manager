import React, { useState } from 'react'
import Toggle from '@/components/Ui/Toggle/Toggle'

const UiToggle: React.VFC = () => {
  //TODO toggled is not used but setToggled is
  const[toggled, setToggled] = useState(false)
  return (
    //TODO also unclear why this is red
    <div>
      <Toggle onChange={({ onClick }) => setToggled(onClick.checked)} />
    </div>
  )
}
export default UiToggle