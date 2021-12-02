import React from 'react'
import UiGrid from '../../Grid/UiGrid'
import UiButton from '@/components/Ui/Button/UiButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'

interface Props {
  allowSubmit?: boolean
  onSubmit?: () => void
}

const UiConfirmButtons: React.VFC<Props> = ({
  allowSubmit = true,
  onSubmit: doSubmit,
}) => {

  return (
    <UiGrid gap={0.5}>
      <UiGrid.Col>
        <UiButton isFull isDisabled={!allowSubmit} onClick={doSubmit}>
          <UiIcon.SubmitAction />
        </UiButton>
      </UiGrid.Col>
    </UiGrid>
  )
}
export default UiConfirmButtons

