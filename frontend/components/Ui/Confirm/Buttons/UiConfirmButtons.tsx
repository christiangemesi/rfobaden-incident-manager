import React from 'react'
import UiGrid from '../../Grid/UiGrid'
import UiButton from '@/components/Ui/Button/UiButton'

interface Props {
  allowSubmit?: boolean
  allowCancel?: boolean
  onSubmit?: () => void
  onCancel?: () => void
}

const UiConfirmButtons: React.VFC<Props> = ({
  allowSubmit = true,
  allowCancel = true,
  onSubmit: doSubmit,
  onCancel: doCancel,
}) => {

  return (
    <UiGrid gap={0.5}>
      <UiGrid.Col size={8}>
        <UiButton isFull isDisabled={!allowSubmit} onClick={doSubmit}>
          Bestätigen
        </UiButton>
      </UiGrid.Col>
      <UiGrid.Col>
        <UiButton isFull isDisabled={!allowCancel} onClick={doCancel}>
          Abbrechen
        </UiButton>
      </UiGrid.Col>
    </UiGrid>
  )
}
export default UiConfirmButtons
