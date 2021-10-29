import { useSetState } from 'react-use'
import { useStatic } from '@/utils/hooks/useStatic'
import Update from '@/utils/update'
import { useEffect } from 'react'

export const useForm = <T>(getInitialValue: () => T): UiFormFieldsState<T> => {
  const [form, setForm] = useSetState<UiFormState<T>>(useStatic(() => {
    const value = getInitialValue()
    return {
      value,
      getInitialValue,
      fields: buildFields(getInitialValue()),
      hasChanged: false,

      // We always start out assuming the form is invalid.
      // Will be updated as soon as validators run for the first time,
      // but then most ofen remain on `false`, since no valid data has been entered at that time.
      isValid: false,

      // Will be overwritten with `setForm`, to which we do not have (safe) access in here.
      update: () => undefined,
    }
  }))

  form.update = setForm
  ;(form.fields as unknown as UiFormChild<T>)[UiFormChild_baseKey] = form
  for (const key of Object.keys(form.fields)) {
    const field = form.fields[key]
    ;(field as unknown as UiFormChild<T>)[UiFormChild_baseKey] = form
  }

  return form.fields
}

export const clearForm = <T>(fields: UiFormFieldsState<T>): void => {
  const form = getUiFormBase(fields)
  form.update((state) => {
    const newFields = { ...state.fields }
    for (const key of Object.keys(newFields)) {
      const field = newFields[key]
      newFields[key] = {
        ...field,
        errors: [],
        isInitial: true,
      }
    }
    return {
      ...state,
      value: state.getInitialValue(),
      isValid: false,
      hasChanged: false,
      fields: newFields,
    }
  })
}

export const setFormField = <T, K extends keyof T>(
  field: UiFormFieldState<T, K>,
  options: {
    value?: T[K],
    errors?: string[],
  },
): void => {
  const form = getUiFormBase(field)
  form.update((state) => {
    const currentField = state.fields[field.key]
    return {
      value: {
        ...state.value,
        [field.key]: options.value === undefined ? state.value[field.key] : options.value,
      },
      fields: {
        ...state.fields,
        [field.key]: {
          ...currentField,
          ...(options.errors === undefined ? {} : {
            errors: options.errors,
            isInitial: false,
            skipNextValidation: true,
          }),
        },
      },
    }
  })
}

export const useValidate = <T>(
  fields: UiFormFieldsState<T>,
  makeValidators: (v: typeof validate) => FieldValidators<T>
): void => {
  const form = getUiFormBase(fields)

  const validators = useStatic(() => makeValidators(validate))

  useEffect(() => {
    const fieldUpdates = {} as {
      [K in keyof T]: Partial<UiFormFieldState<T, keyof T>>
    }
    let errorCount = 0
    for (const key of Object.keys(fields)) {
      const field = form.fields[key]
      if (field.skipNextValidation) {
        fieldUpdates[key] = {
          skipNextValidation: false,
        }
        continue
      }

      fieldUpdates[key] = { errors: []}
      for (const validate of validators[key]) {
        const message = validate(form.value[key], form.value)
        if (message !== true) {
          errorCount += 1
          fieldUpdates[key].errors?.push(message)
        }
      }
    }
    form.update((state) => {
      const newFields = {} as UiFormFieldsState<T>
      for (const key of Object.keys(fieldUpdates)) {
        newFields[key] = {
          ...state.fields[key],
          ...fieldUpdates[key],
        }
      }
      return {
        ...state,
        isValid: errorCount === 0,
        fields: newFields,
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.value])
}

export interface UiFormState<T> {
  value: T
  getInitialValue: () => T
  fields: UiFormFieldsState<T>
  isValid: boolean
  hasChanged: boolean
  update: Update<UiFormState<T>>
}

export type UiFormFieldsState<T> = {
  [K in keyof T]: UiFormFieldState<T, K>
}

export interface UiFormFieldState<T, K extends keyof T> {
  key: K
  errors: string[]
  isInitial: boolean
  skipNextValidation: boolean
}


const UiFormChild_baseKey = Symbol('UiFormChild.base')
interface UiFormChild<T> {
  [UiFormChild_baseKey]: UiFormState<T>
}

export const getUiFormBase = <T>(field: UiFormFieldsState<T> | UiFormFieldState<T, keyof T>): UiFormState<T> => (
  (field as unknown as UiFormChild<T>)[UiFormChild_baseKey]
)

const buildFields = <T>(value: T): UiFormFieldsState<T> => {
  const fields = {} as UiFormFieldsState<T>
  for (const key of Object.keys(value)) {
    fields[key] = {
      key,
      errors: [],
      isInitial: true,
      skipNextValidation: false,
    }
  }
  return fields
}

interface Validator<T, V> {
  (value: V, record: T): true | string
}

type FieldValidators<T> = {
  [K in keyof T]: Validator<T, T[K]>[]
}

const validate = {
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