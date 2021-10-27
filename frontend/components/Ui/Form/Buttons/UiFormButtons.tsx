import { clearForm, UiFormField_base, UiFormFieldsState, UiFormState } from '@/components/Ui/Form'
import UiConfirmButtons from '@/components/Ui/Confirm/Buttons/UiConfirmButtons'
import { useCallback } from 'react'

interface Props<T> {
  form: UiFormFieldsState<T>
  onSubmit: (value: T) => void
  onCancel?: () => void
}

const UiFormButtons = <T,>({
  form: fields,
  onSubmit: pushSubmit,
  onCancel: pushCancel,
}: Props<T>): JSX.Element => {
  const form = fields[UiFormField_base] as UiFormState<T>
  const {
    value,
    isValid,
  } = form

  const handleSubmit = useCallback(async () => {
    if (isValid) {
      await pushSubmit(value)
    }
  }, [isValid, value, pushSubmit])

  const handleCancel = useCallback(async () => {
    if (pushCancel !== undefined) {
      await pushCancel()
    }
    setTimeout(() => {
      clearForm(fields)
    })
  }, [fields, pushCancel])

  return (
    <UiConfirmButtons
      allowSubmit={form.isValid}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}
export default UiFormButtons
