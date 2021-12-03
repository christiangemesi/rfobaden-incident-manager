import { getFormBaseState, UiFormState } from '@/components/Ui/Form'
import React, { useCallback } from 'react'
import UiConfirmButtons from '@/components/Ui/Confirm/Buttons/UiConfirmButtons'

interface Props<T> {
  form: UiFormState<T>
}

const UiFormButtons = <T,>({
  form,
}: Props<T>): JSX.Element => {
  const baseForm = getFormBaseState(form)
  const {
    isValid,
    value,
  } = baseForm

  const pushSubmit = baseForm.onSubmit

  const handleSubmit = useCallback(async () => {
    if (isValid && pushSubmit !== null) {
      await pushSubmit(value)
    }
  }, [isValid, value, pushSubmit])

  return (
    <UiConfirmButtons
      allowSubmit={isValid}
      onSubmit={handleSubmit}
    />
  )
}
export default UiFormButtons
