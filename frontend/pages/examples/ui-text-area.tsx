import React, { useState } from 'react'
import UiTextArea from '@/components/Ui/Input/Text/UiTextArea'

/**
 * `UiTextAreaExample` is an example page for the {@link UiTextArea} component.
 */
const UiTextAreaExample: React.VFC = () => {
  const [value, setValue] = useState<string | null>('')
  const [value2, setValue2] = useState<string | null>('blabla')
  return (
    <React.Fragment>
      <h2>UiTextArea</h2>
      <UiTextArea value={value} placeholder="Schrieb was dri" onChange={setValue} />
      <UiTextArea label="test" value={value2} rows={1} onChange={setValue2} />
      <UiTextArea value={value}
        onChange={setValue} errors={['You can never make me happy']} />
    </React.Fragment>
  )
}
export default UiTextAreaExample
