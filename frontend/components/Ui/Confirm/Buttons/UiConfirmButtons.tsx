import React from 'react'
import UiGrid from '../../Grid/UiGrid'
import UiButton from '@/components/Ui/Button/UiButton'

interface Props {
  /**
   * Defines the type of the {@link UiButton}.
   */
  type?: 'button' | 'submit'

  /**
   * The {@link UiButton} text.
   */
  text?: string

  /**
   * Sets the {@link UiButton} to be disabled.
   */
  allowSubmit?: boolean

  /**
   * Event caused by clicking the {@link UiButton}.
   */
  onSubmit?: () => void
}

/**
 * `UiConfirmButtons` is a wrapper for a {@link UiButton} used to confirm forms.
 */
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

