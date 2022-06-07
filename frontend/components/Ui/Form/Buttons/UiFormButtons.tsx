import { getFormBaseState, UiFormState } from '@/components/Ui/Form'
import React from 'react'
import UiConfirmButtons from '@/components/Ui/Confirm/Buttons/UiConfirmButtons'

interface Props<T> {
  /**
   * The form controlled by the buttons.
   */
  form: UiFormState<T>

  /**
   * The text for the submit button.
   */
  text: string
}

/**
 * `UiFormButtons` is a component displaying form control buttons.
 */
const UiFormButtons = <T,>({
  form,
  text,
}: Props<T>): JSX.Element => {
  const baseForm = getFormBaseState(form)
  const { isValid } = baseForm
  return (
    <UiConfirmButtons
      type="submit"
      allowSubmit={isValid}
      text={text}
    />
  )
}
export default UiFormButtons
