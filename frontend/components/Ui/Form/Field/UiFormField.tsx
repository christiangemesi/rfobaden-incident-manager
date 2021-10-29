import React, { Dispatch, memo, ReactNode, useCallback, useMemo } from 'react'
import { getUiFormBase, UiFormFieldState } from '@/components/Ui/Form'

interface Props<T, K extends keyof T> {
  field: UiFormFieldState<T, K>
  children: (props: UiFormInputProps<T[K]>) => ReactNode
}

const UiFormField = <T, K extends keyof T>({ field, children }: Props<T, K>): JSX.Element => {
  const form = getUiFormBase(field)
  const {
    value: { [field.key]: value },
    update: setForm,
  } = form
  const {
    key,
    errors,
    isInitial,
  } = field

  const setValue = useCallback((newValue: T[K]) => {
    setForm((form) => {
      return {
        ...form,
        value: {
          ...form.value,
          [key]: newValue,
        },
        fields: {
          ...form.fields,
          [key]: {
            ...form.fields[key],
            isInitial: false,

            // Change the (untyped) reload property of the state belonging to this field.
            // This enables us to memoize this component, without requiring further changes
            // to how the UiFormState works.
            [reloadTriggerKey]: {},
          },
        },
      }
    })
  }, [key, setForm])

  const inputProps: UiFormInputProps<T[K]> = useMemo(() => ({
    value,
    errors: isInitial ? [] : errors,
    onChange: setValue,
  }), [value, errors, isInitial, setValue])

  const input = useMemo(() => (
    children(inputProps)
  ), [children, inputProps])

  return (
    <React.Fragment>
      {input}
    </React.Fragment>
  )
}
export default memo(UiFormField, (prev, next) => (
  prev.field === next.field
)) as unknown as typeof UiFormField

export interface UiFormInputProps<T> {
  value?: T
  onChange?: Dispatch<T>
  errors?: string[]
}

const reloadTriggerKey = Symbol('reloadTrigger')