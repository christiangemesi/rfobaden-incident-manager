import { getFormBaseState, UiFormState, UiFormStateField, UiFormValue } from '@/components/Ui/Form/index'
import { useUpdateEffect } from 'react-use'
import { useStatic } from '@/utils/hooks/useStatic'

export interface Validator<T, V> {
  (value: V, record: T): true | string
}

export type Validation<T> = {
  [K in keyof T]:
    Exclude<T[K], null | undefined> extends UiFormValue
      ? Array<Validator<T, T[K]>>
      : Array<Validator<T, T[K]>> | Validation<T[K]>
}

export type ValidationFn<T> = (v: typeof validate) => Validation<T>

export const useValidate = <T>(fields: UiFormState<T>, makeValidators: ValidationFn<T>): void => {
  const state = useStatic(() => {
    const state = new ValidationState<T>(getFormBaseState(fields).value, makeValidators(validate))
    validateState(state, fields)
    return state
  })
  useUpdateEffect(() => {
    validateState(state, fields)
  }, [state, fields])
}

const validateState = <T>(state: ValidationState<T>, fields: UiFormState<T>): void => {
  const { value, isValid, update } = getFormBaseState(fields)
  const isNowValid = state.validate(value, fields)
  if (isValid !== isNowValid) {
    update({ isValid: isNowValid })
  }
}

const validate = Object.freeze({
  notNull: <T, V extends unknown | null | undefined>(
    options: { message?: string } = {}
  ): Validator<T, V> => (value) => {
    const {
      message = 'darf nicht leer sein',
    } = options
    if (value == null) {
      return message
    }
    return true
  },
  notEmpty: <T, V extends { length: number } | null | undefined>(
    options: { message?: string, allowNull?: boolean } = {}
  ): Validator<T, V> => (value) => {
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
  notBlank: <T, V extends string | null | undefined>(
    options: { message?: string, allowNull?: boolean } = {}
  ): Validator<T, V> => (value) => {
    const message = options.message ?? 'darf nicht leer sein'
    const allowNull = options.allowNull ?? false

    if (value == null) {
      return allowNull || message
    }
    return value.trim().length !== 0 || message
  },
  match: <T, V extends string | null | undefined>(
    pattern: RegExp, options: { message?: string } = {}
  ): Validator<T, V> => (value) => {
    const {
      message = 'ist nicht gültig',
    } = options
    if (value != null && !pattern.test(value as string)) {
      return message
    }
    return true
  },
  minLength: <T, V extends { length: number } | null | undefined>(
    min: number, options: { message?: string } = {}
  ): Validator<T, V> => (value) => {
    const {
      message = `muss mindestens ${min} Zeichen lang sein`,
    } = options
    if (value != null && value.length < min) {
      return message
    }
    return true
  },
})
export default validate

class ValidationState<T> {
  private previousValue: T
  private previousResult: boolean | undefined

  private readonly validators = {} as Record<keyof T, Array<Validator<T, T[keyof T]>>>

  private readonly nestedStates = new Map<keyof T, ValidationState<T[keyof T]>>()

  constructor(initialValue: T, validators: Validation<T>) {
    this.previousValue = initialValue
    for (const fieldName of Object.keys(validators)) {
      const fieldValidators = validators[fieldName]
      if (Array.isArray(fieldValidators)) {
        this.validators[fieldName] = fieldValidators
      } else {
        this.nestedStates.set(fieldName, new ValidationState<T[keyof T]>(
          initialValue[fieldName],
          fieldValidators as Validation<T[keyof T]>
        ))
      }
    }
  }

  validate(value: T, form: UiFormState<T>): boolean {
    if (this.previousValue === value && this.previousResult !== undefined) {
      return this.previousResult
    }

    this.previousResult = true
    for (const fieldName of Object.keys(form)) {
      const field = form[fieldName]
      if (fieldName in this.validators) {
        const isFieldValid = this.validateValue(value, fieldName, field as UiFormStateField<T, keyof T>)
        this.previousResult &&= isFieldValid
      } else {
        const nestedState = this.nestedStates.get(fieldName)
        if (nestedState == undefined) {
          // This means that there is a field in the form value that is not actually handled (and validated)
          // by the form. This is most often a field like `id`, `createdAt` or `updatedAt`.
          continue
        }
        const isFieldValid = nestedState.validate(value[fieldName], field as UiFormState<T[keyof T]>)
        this.previousResult &&= isFieldValid
      }
    }
    this.previousValue = value
    return this.previousResult
  }

  private validateValue = <K extends keyof T>(value: T, fieldName: K, field: UiFormStateField<T, K>): boolean => {
    if (field.skipNextValidation) {
      field.update({
        skipNextValidation: false,
      })
      return field.errors.length === 0
    }

    const fieldValue = value[fieldName]
    const errors = [] as string[]
    for (const validate of this.validators[fieldName]) {
      const error = validate(fieldValue, value)
      if (error !== true) {
        errors.push(error)
      }
    }
    field.update({
      errors,
    })
    return errors.length === 0
  }
}
