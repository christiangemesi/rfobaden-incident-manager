import React, { Dispatch, ReactNode, useMemo } from 'react'
import { UiFormFieldState, UiFormState_updateSymbol, UiFormState_valueSymbol } from '@/components/Ui/Form/UiForm'

interface Props<T, V> {
  field: UiFormFieldState<T, V>
  children: (props: UiFormInputProps<V>) => ReactNode
}

const UiFormField = <T, V>({ field, children }: Props<T, V>): JSX.Element => {
  const inputProps: UiFormInputProps<V> = useMemo(() => ({
    value: field.value,
    errors: field.isInitial ? [] : field.errors,
    onChange: (value) => {
      field.base[UiFormState_updateSymbol]((state) => ({
        ...state,
        [field.key]: {
          ...state[field.key],
          value,
          isInitial: false,
        },
        [UiFormState_valueSymbol]: {
          ...state[UiFormState_valueSymbol],
          [field.key]: value,
        },
      }))
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
