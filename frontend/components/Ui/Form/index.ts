import { makeChildPatcher, makeChildUpdater, Patcher, toUpdate } from '@/utils/update'
import { useGetSet, useUpdateEffect } from 'react-use'
import { useStatic } from '@/utils/hooks/useStatic'

/**
 * `UiFormBaseState` is the base state for a form.
 */
export interface UiFormBaseState<T> extends UpdatablePart {
  /**
   * The form's current value.
   */
  value: T

  /**
   * The form's default value, used when creating a new record.
   */
  defaultValue: T

  /**
   * The form's fields.
   */
  fields: UiFormState<T>

  /**
   * Whether all fields of the form are currently valid.
   */
  isValid: boolean

  /**
   * Callback invoked when the form is submitted.
   */
  onSubmit: ((value: T) => void | Promise<void>) | null

  /**
   * Callback invoked when the form is cancelled.
   */
  onCancel: (() => void | Promise<void>) | null
}

/**
 * `UiFormState` contains nested fields of a form.
 * <p>
 *  {@link UiFormValue Primitive values} use {@link UiFormStateField} as value,
 *  any other complex values use a nested {@link UiFormState}.
 * </p>
 */
export type UiFormState<T> = {
  [K in keyof T]:
    Exclude<T[K], null | undefined> extends UiFormValue
      ? UiFormStateField<T, K>
      : UiFormState<T[K]>
}

/**
 * `UiFormStateField` contains the state of a single, non-nested form field..
 */
export interface UiFormStateField<T, K extends keyof T> extends UpdatablePart {
  /**
   * The errors that make the field invalid.
   * This being empty makes the field valid.
   */
  errors: string[]

  /**
   * Whether the field has been changed since the form has been initialized.
   */
  hasChanged: boolean

  /**
   * Whether this field should be skipped in the next validation cycle.
   * Used to display custom errors not caused by the default validators.
   */
  skipNextValidation: boolean

  /**
   * The field's current value.
   */
  value: T[K]

  /**
   * Sets the field's value.
   *
   * @param value The new value.
   */
  setValue(value: T[K]): void
}

/**
 * `UpdatablePart` defines an object whose field values can be freely updated.
 */
interface UpdatablePart {
  /**
   * A {@link Patcher} updating the object.
   */
  update: Patcher<this>
}

/**
 * `UiFormValue` is a collection of all types which are handled as non-nested values by forms.
 *  They represent the values that can be modified by the user via input field.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UiFormValue = boolean | string | number | bigint | any[] | Date | File

/**
 * `useForm` is a React hook that creates a new form.
 *
 * @param values The form's default values.
 */
export function useForm<T>(values: () => T): UiFormState<T>

/**
 * `useForm` is a React hook that creates a new form.
 * @param base The record that is being edited, if it exists.
 * @param values The form's default values.
 */
export function useForm<T>(base: T | null, values: () => T): UiFormState<T>

// Implementation of `useForm`.
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

/**
 * `useSubmit` is a React hook that accepts a function which is invoked
 * when a form is being submitted.
 *
 * @param form The form.
 * @param callback The submit callback.
 */
export const useSubmit = <T>(
  form: UiFormState<T>,
  callback: ((value: T) => void | Promise<void>) | undefined | null,
): void => {
  getFormBaseState(form).onSubmit = callback ?? null
}

/**
 * `useCancel` is a React hook that accepts a function which is invoked
 * when a form is being cancelled.
 *
 * @param form The form.
 * @param callback The cancel callback.
 */
export const useCancel = <T>(
  form: UiFormState<T>,
  callback: (() => void | Promise<void>) | undefined | null,
): void => {
  getFormBaseState(form).onCancel = callback ?? null
}

/**
 * Clears a form by resetting it to its default state.
 *
 * @param form The form to clear.
 */
export const clearForm = (form: UiFormState<unknown>): void => {
  const baseForm = getFormBaseState(form)
  baseForm.update((prev) => ({
    value: prev.defaultValue,
    isValid: false,
    fields: setFieldValues(prev.fields, prev.defaultValue),
  }))
}

/**
 * Sets the field values of a {@link UiFormState} to the values of a specific default value.
 *
 * @param state The state whose values are replaced.
 * @param defaultValue The value containing the new field values.
 */
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

/**
 * Sets the value of a specific {@link UiFormStateField}, resetting the field to its initial state.
 *
 * @param field The field to reset.
 * @param defaultValue The default value for the field.
 */
const setFieldValue = <T>(field: UiFormStateField<T, keyof T>, defaultValue: T[keyof T]): typeof field => {
  return {
    ...field,
    value: defaultValue,
    hasChanged: false,
    errors: [],
  }
}

/**
 * Creates a {@link UiFormState} whose field values are read from and written to a specific value.
 *
 * @param value The value to read from and write to.
 * @param updateValue A {@link Patcher} updating the {@code value}.
 * @param update A {@link Patcher} updating the {@link UiFormState} itself.
 */
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

/**
 * Creates a {@link UiFormStateField} whose value is read from and written to a specific value.
 *
 * @param value The value to read from and write to.
 * @param setValue Replaces the value.
 * @param update A {@link Patcher} updating the {@link UiFormStateField} itself.
 */
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

/**
 * Updates fields of a {@link UiFormStateField}.
 *
 * @param field The field to update.
 * @param patch The new fields.
 */
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

/**
 * The key under which private form values are stored.
 */
const formKey = Symbol('form')

/**
 * Extracts the {@link UiFormBaseState base state} of a {@link UiFormState}.
 *
 * @param base The {@link UiFormStateField} whose base state is extracted.
 */
export const getFormBaseState = <T>(base: UiFormState<T>): UiFormBaseState<T> => {
  if (!(formKey in base)) {
    throw new Error(`fields does not contain form: ${base}`)
  }
  return (base as unknown as { [formKey]: UiFormBaseState<T> })[formKey]
}

/**
 * Checks whether a form field value is a {@link UiFormStateField}.
 *
 * @param field The field to check.
 */
export const isFormFieldState = <T, K extends keyof T>(field: UiFormStateField<T, K> | UiFormState<T[K]>): field is UiFormStateField<T, K> => {
  return field != null && typeof field == 'object' && 'value' in field && 'setValue' in field
}

/**
 * Checks whether a form field value is a {@link UiFormValue}.
 *
 * @param value The field to check.
 */
const isFormValue = (value: unknown): value is UiFormValue => {
  const isPrimitive = value == null || typeof value !== 'object' && typeof value !== 'function'
  return isPrimitive || value instanceof Date || value instanceof File || Array.isArray(value)
}



