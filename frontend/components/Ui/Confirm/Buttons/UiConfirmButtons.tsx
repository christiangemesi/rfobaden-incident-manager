import React from 'react'
import UiGrid from '../../Grid/UiGrid'
import UiButton from '@/components/Ui/Button/UiButton'

interface Props {
  type?: 'button' | 'submit'
  text?: string
  allowSubmit?: boolean
  onSubmit?: () => void
}

const UiConfirmButtons: React.VFC<Props> = ({
  type,
  text,
  allowSubmit = true,
  onSubmit: doSubmit,
}) => {

  return (
    <UiGrid gap={0.5}>
      <UiGrid.Col>
        <UiButton type={type} isFull isDisabled={!allowSubmit} onClick={doSubmit}>
          {text}
        </UiButton>
      </UiGrid.Col>
    </UiGrid>
  )
}
export default UiConfirmButtons

