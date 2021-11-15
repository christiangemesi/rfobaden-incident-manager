import { clearForm, getUiFormBase, UiFormFieldsState } from '@/components/Ui/Form'
import UiConfirmButtons from '@/components/Ui/Confirm/Buttons/UiConfirmButtons'
import { useCallback } from 'react'
import { useMountedState } from 'react-use'

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
  const form = getUiFormBase(fields)
  const {
    value,
    isValid,
  } = form
  const isMounted = useMountedState()

  const handleSubmit = useCallback(async () => {
    if (isValid) {
      await pushSubmit(value)
    }
  }, [isValid, value, pushSubmit])

  const handleCancel = useCallback(async () => {
    if (pushCancel !== undefined) {
      await pushCancel()
    }

    // Wait for updates to the view to happen before clearing the form.
    setTimeout(() => {
      if (isMounted()) {
        clearForm(fields)
      }
    })
  }, [pushCancel, fields, isMounted])

  return (
    <UiConfirmButtons
      allowSubmit={form.isValid}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}
export default UiFormButtons
