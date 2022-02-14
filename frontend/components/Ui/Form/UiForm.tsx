import UiFormButtons from '@/components/Ui/Form/Buttons/UiFormButtons'
import UiFormField from '@/components/Ui/Form/Field/UiFormField'
import { getFormBaseState, UiFormState } from '@/components/Ui/Form/index'
import { FormEvent, ReactNode, useCallback } from 'react'

interface Props<T> {
  form: UiFormState<T>
  children: ReactNode
}

const UiForm = <T,>({ form, children }: Props<T>) => {
  const baseForm = getFormBaseState(form)
  const {
    isValid,
    value,
  } = baseForm

  const pushSubmit = baseForm.onSubmit

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (isValid && pushSubmit !== null) {
      await pushSubmit(value)
    }
  }, [isValid, value, pushSubmit])

  return (
    <form onSubmit={handleSubmit}>
      {children}
    </form>
  )
}

export default Object.assign(UiForm, {
  Field: UiFormField,
  Buttons: UiFormButtons,
})
