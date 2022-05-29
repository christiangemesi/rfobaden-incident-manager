import { getFormBaseState, UiFormState } from '@/components/Ui/Form'
import React from 'react'
import UiConfirmButtons from '@/components/Ui/Confirm/Buttons/UiConfirmButtons'

interface Props<T> {
  form: UiFormState<T>
  text: string
}

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
