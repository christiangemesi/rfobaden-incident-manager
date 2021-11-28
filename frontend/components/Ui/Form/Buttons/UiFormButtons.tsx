import { clearForm, getFormBaseState, UiFormState } from '@/components/Ui/Form'
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
    fields,
    value,
  } = baseForm

  const pushSubmit = baseForm.onSubmit
  const pushCancel = baseForm.onCancel

  const handleSubmit = useCallback(async () => {
    if (isValid && pushSubmit !== null) {
      await pushSubmit(value)
    }
  }, [isValid, value, pushSubmit])

  const handleCancel = useCallback(async () => {
    clearForm(fields)
    if (pushCancel !== null) {
      await pushCancel()
    }
  }, [fields, pushCancel])

  return (
    <UiConfirmButtons
      allowSubmit={isValid}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}
export default UiFormButtons
