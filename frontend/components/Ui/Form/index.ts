import { makeChildPatcher, makeChildUpdater, Patcher, toUpdate } from '@/utils/update'
import { useCallback } from 'react'
import { useGetSet, useUpdateEffect } from 'react-use'
import { useStatic } from '@/utils/hooks/useStatic'

export interface UiFormBaseState<T> extends UpdatablePart {
  value: T
  defaultValue: T
  fields: UiFormState<T>
  isValid: boolean
  onSubmit: ((value: T) => void | Promise<void>) | null
  onCancel: (() => void | Promise<void>) | null
}

export type UiFormState<T> = {
  [K in keyof T]:
    Exclude<T[K], null | undefined> extends UiFormValue
      ? UiFormStateField<T, K>
      : UiFormState<T[K]>
}

export interface UiFormStateField<T, K extends keyof T> extends UpdatablePart {
  errors: string[]
  hasChanged: boolean
  skipNextValidation: boolean
  value: T[K]
  setValue(value: T[K]): void
}

interface UpdatablePart {
  update: Patcher<this>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UiFormValue = boolean | string | number | bigint | any[] | Date | File

export function useForm<T>(values: () => T): UiFormState<T>
export function useForm<T>(base: T | null, values: () => T): UiFormState<T>
export function useForm<T>(baseOrValues: T | null | (() => T), valuesOrUndefined?: () => T): UiFormState<T> {
  const [base, makeValues] = valuesOrUndefined === undefined ? (
    [null, baseOrValues as () => T]
  ) : (
    [baseOrValues as T, valuesOrUndefined]
  )

  const values = useStatic(makeValues)

  const [getForm, setForm] = useGetSet((): UiFormBaseState<T> => {
    const value = base ?? values
    const updateForm: Patcher<UiFormBaseState<T>> = (patch) => {
      setForm(toUpdate(patch))
    }
    const updateValue = makeChildPatcher(updateForm, 'value')
    return {
      value,
      defaultValue: value,
      fields: mapValueToState(value, updateValue, makeChildPatcher(updateForm, 'fields')),
      isValid: false,
      onSubmit: null,
      onCancel: null,
      update: updateForm,
    }
  })
  const form = getForm()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(form.fields as any)[formKey] = form

  useUpdateEffect(() => {
    const defaultValue = base ?? values
    setForm((currentForm) => ({
      ...currentForm,
      value: defaultValue,
      defaultValue: defaultValue,
      fields: setFieldValues(currentForm.fields, defaultValue),
    }))
  }, [base])

  return form.fields
}

export const useSubmit = <T>(
  form: UiFormState<T>,
  callback: (value: T) => void | Promise<void>,
  deps: unknown[] = [],
): void => {
  getFormBaseState(form).onSubmit =
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback(callback, deps)
}

export const useCancel = <T>(
  form: UiFormState<T>,
  callback: (() => void | Promise<void>) | undefined,
  deps: unknown[] = [],
): void => {
  getFormBaseState(form).onCancel =
    useCallback(async () => {
      if (callback) {
        await callback()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
}

export const clearForm = (form: UiFormState<unknown>): void => {
  const baseForm = getFormBaseState(form)
  baseForm.update((prev) => ({
    value: prev.defaultValue,
    isValid: false,
    fields: setFieldValues(prev.fields, prev.defaultValue),
  }))
}

const setFieldValues = <T>(state: UiFormState<T>, defaultValue: T): UiFormState<T> => {
  const newState = {} as UiFormState<T>
  for (const fieldName of Object.keys(state)) {
    const fieldValue = state[fieldName]
    const defaultFieldValue = defaultValue[fieldName]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(newState as any)[fieldName] = isFormFieldState(fieldValue)
      ? setFieldValue(fieldValue as UiFormStateField<T, keyof T>, defaultFieldValue)
      : setFieldValues(fieldValue as UiFormState<T[keyof T]>, defaultFieldValue)
  }
  return newState
}

const setFieldValue = <T>(field: UiFormStateField<T, keyof T>, defaultValue: T[keyof T]): typeof field => {
  return {
    ...field,
    value: defaultValue,
    hasChanged: false,
    errors: [],
  }
}

const mapValueToState = <T>(
  value: T,
  updateValue: Patcher<T>,
  update: Patcher<UiFormState<T>>,
): UiFormState<T> => {
  const fields = {} as UiFormState<T>
  for (const fieldName of Object.keys(value)) {

    const fieldValue = value[fieldName]
    const updateField = makeChildPatcher(update, fieldName)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(fields as any)[fieldName] = isFormValue(fieldValue) ? (
      mapValueToStateField(
        value[fieldName],
        makeChildUpdater(updateValue, fieldName),
        updateField as Patcher<UiFormStateField<T, keyof T>>,
      )
    ) : (
      mapValueToState<T[keyof T]>(
        fieldValue,
        makeChildPatcher(updateValue, fieldName),
        updateField as Patcher<UiFormState<T[keyof T]>>,
      )
    )
  }
  return fields
}

const mapValueToStateField = <T, K extends keyof T>(
  value: T[K],
  setValue: (value: T[K]) => void,
  update: Patcher<UiFormStateField<T, K>>,
): UiFormStateField<T, K> => {
  return {
    errors: [],
    hasChanged: false,
    skipNextValidation: false,
    update: (patch) => {
      if ('value' in patch) {
        throw new Error('field value should be set using \'setValue\'')
      }
      update(patch)
    },
    value,
    setValue(newValue) {
      update({ value: newValue, hasChanged: true })
      setValue(newValue)
    },
  }
}

export const setFormField = <T, K extends keyof T>(
  field: UiFormStateField<T, K>,
  patch: Partial<{ value: T[K], errors: string[] }>
): void => {
  const update: Partial<typeof field> = {}
  if (patch.errors !== undefined) {
    update.errors = patch.errors
    update.skipNextValidation = true
  }
  if (Object.keys(update).length !== 0) {
    field.update(update)
  }

  if (patch.value !== undefined) {
    field.setValue(patch.value)
  }
}

const formKey = Symbol('form')

export const getFormBaseState = <T>(base: UiFormState<T>): UiFormBaseState<T> => {
  if (!(formKey in base)) {
    throw new Error(`fields does not contain form: ${base}`)
  }
  return (base as unknown as { [formKey]: UiFormBaseState<T> })[formKey]
}

export const isFormFieldState = <T, K extends keyof T>(field: UiFormStateField<T, K> | UiFormState<T[K]>): field is UiFormStateField<T, K> => {
  return field != null && typeof field == 'object' && 'value' in field && 'setValue' in field
}

const isFormValue = (value: unknown): value is UiFormValue => {
  const isPrimitive = value == null || typeof value !== 'object' && typeof value !== 'function'
  return isPrimitive || value instanceof Date || value instanceof File || Array.isArray(value)
}



