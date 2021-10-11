import React, { Dispatch, useEffect, useMemo, useState } from 'react'
import UiFormField from './Field/UiFormField'

export const useForm = <T,>(getInitialValue: () => T): [T, UiFormState<T>] => {
  const [state, setState] = useState<UiFormState<T>>(() => {
    const value = getInitialValue()
    const state = Object.keys(value).reduce((state, key) => {
      (state as unknown)[key] = {
        key,
        initialValue: value[key],
        value: value[key],
        errors: [],
        base: state,
        isInitial: true,
        skipValidation: false,
      } as UiFormFieldState<T, T[typeof key]>
      return state
    }, {
      [UiFormState_valueSymbol]: value,
      [UiFormState_updateSymbol]: (v) => setState(v),
    } as UiFormState<T>)
    return state
  })
  return [state[UiFormState_valueSymbol], state]
}
export const useValidate = <T,>(state: UiFormState<T>, makeValidators: (v: typeof validate) => FieldValidators<T>): void => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fieldValidators = useMemo(() => makeValidators(validate), [])

  const baseValue = state[UiFormState_valueSymbol]
  const update = state[UiFormState_updateSymbol]

  useEffect(() => {
    const allErrors = {} as Record<keyof T, string[]>
    for (const key of Object.keys(fieldValidators)) {
      const validators = fieldValidators[key]

      const errors = [] as string[]
      for (const validate of validators) {
        const message = validate(baseValue[key], baseValue)
        if (message !== true) {
          errors.push(message)
        }
      }
      allErrors[key] = errors
    }
    update((state) => {
      let newState = { ...state }
      for (const key of Object.keys(allErrors)) {
        const field = newState[key]
        if (field.skipValidation) {
          newState = {
            ...newState,
            [key]: {
              ...field,
              skipValidation: false,
            },
          }
          continue
        }

        newState = {
          ...newState,
          [key]: {
            ...field,
            errors: allErrors[key],
          },
        }
      }
      return newState
    })
  }, [fieldValidators, baseValue, update])
}

export type UiFormState<T> = {
  [K in keyof T]: UiFormFieldState<T, T[K]>
} & {
  [UiFormState_valueSymbol]: T
  [UiFormState_updateSymbol]: Dispatch<UiFormStateUpdate<T>>
}

type UiFormStateUpdate<T> = (state: UiFormState<T>) => UiFormState<T>

export const UiFormState_valueSymbol = Symbol('value')
export const UiFormState_updateSymbol = Symbol('update')

export interface UiFormFieldState<T, V> {
  initialValue: V
  value: V
  key: keyof T
  errors: string[]
  base: UiFormState<T>
  isInitial: boolean
  skipValidation: boolean
}

export const setUiFormFieldValue = <T, V>(field: UiFormFieldState<T, V>, value: V): void => {
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
}

interface Validator<T, V> {
  (value: V, record: T): true | string
}

type FieldValidators<T> = {
  [K in keyof T]: Validator<T, T[K]>[]
}

export const validate = {
  notNull: <T, V extends unknown | null | undefined>(options: { message?: string } = {}): Validator<T, V> => (value) => {
    const {
      message = 'darf nicht leer sein',
    } = options
    if (value == null) {
      return message
    }
    return true
  },
  notEmpty: <T, V extends { length: number }| null | undefined>(options: { message?: string, allowNull?: boolean } = {}): Validator<T, V> => (value) => {
    const message = options.message ?? 'darf nicht leer sein'
    const allowNull = options.allowNull ?? false
    if (value == null) {
      return allowNull || message
    }
    if (value.length === 0) {
      return message
    }
    return true
  },
  notBlank: <T, V extends string | null | undefined>(options: { message?: string, allowNull?: boolean } = {}): Validator<T, V> => (value) => {
    const message = options.message ?? 'darf nicht leer sein'
    const allowNull = options.allowNull ?? false

    if (value == null) {
      return allowNull || message
    }
    return value.trim().length !== 0 || message
  },
  match: <T, V extends string | null | undefined>(pattern: RegExp, options: { message?: string } = {}): Validator<T, V> => (value) => {
    const {
      message = 'ist nicht gültig',
    } = options
    if (value != null && !pattern.test(value as string)) {
      return message
    }
    return true
  },
  minLength: <T, V extends { length: number } | null | undefined>(min: number, options: { message?: string } = {}): Validator<T, V> => (value) => {
    const {
      message = `muss mindestens ${min} Zeichen lang sein`,
    } = options
    if (value != null && value.length < min) {
      return message
    }
    return true
  },
}

const UiForm = {
  Field: UiFormField,
  clear: <T,>(form: UiFormState<T>): void => {
    const value = form[UiFormState_valueSymbol]
    form[UiFormState_updateSymbol]((state) => {
      const initialValue = {} as T
      let newState = { ...state }
      for (const key of Object.keys(value)) {
        const field = newState[key]
        ;(initialValue as unknown)[key] = field.initialValue
        newState = {
          ...newState,
          [key]: {
            ...field,
            value: field.initialValue,
            errors: [],
            isInitial: true,
            skipValidation: false,
          },
        }
      }
      return {
        ...newState,
        [UiFormState_valueSymbol]: initialValue,
      }
    })
  },
  set: setUiFormFieldValue,
  setErrors: <T,>(field: UiFormFieldState<T, unknown>, errors: string[]): void => {
    field.base[UiFormState_updateSymbol]((state) => ({
      ...state,
      [field.key]: {
        ...state[field.key],
        errors,
        skipValidation: true,
      },
    }))
  },
}
export default UiForm