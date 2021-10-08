import React, { Dispatch, ReactNode, useMemo } from 'react'
import { setUiFormFieldValue, UiFormFieldState } from '@/components/Ui/Form/UiForm'

interface Props<T, V> {
  field: UiFormFieldState<T, V>
  children: (props: UiFormInputProps<V>) => ReactNode
}

const UiFormField = <T, V>({ field, children }: Props<T, V>): JSX.Element => {
  const inputProps: UiFormInputProps<V> = useMemo(() => ({
    value: field.value,
    errors: field.isInitial ? [] : field.errors,
    onChange: (value) => {
      setUiFormFieldValue(field, value)
    },
  }), [field])
  const child = useMemo(() => (
    children(inputProps)
  ), [children, inputProps])
  return (
    <div>
      {child}
    </div>
  )
}
export default UiFormField

export interface UiFormInputProps<T> {
  value?: T
  onChange?: Dispatch<T>
  errors?: string[]
}
