import { getFormBaseState, UiFormState, UiFormStateField, UiFormValue } from '@/components/Ui/Form/index'
import { useUpdateEffect } from 'react-use'
import { useStatic } from '@/utils/hooks/useStatic'

/**
 * {@link Validator} is a function that validates a field value.
 */
export interface Validator<T, V> {
  /**
   * Validate a field value.
   *
   * @param value The field value.
   * @param record The record to which the field belongs.
   * @return `true` if the value is valid, or an error message.
   */
  (value: V, record: T): true | string
}

/**
 * `Validation` contains validators for all fields of a value.
 */
export type Validation<T> = {
  [K in keyof T]:
    Exclude<T[K], null | undefined> extends UiFormValue
      ? Array<Validator<T, T[K]>>
      : Array<Validator<T, T[K]>> | Validation<T[K]>
}

/**
 * `ValidationFn` is a function that creates a {@link Validation}.
 */
export type ValidationFn<T> = (v: typeof validate) => Validation<T>

/**
 * `useValidate` is a React hook that defines validators for a form.
 *
 * @param fields The form fields to validate.
 * @param makeValidators Creates the validators for the form.
 */
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

/**
 * Validates the current state of a form.
 *
 * @param state The current validation state.
 * @param fields The form fields to validate.
 */
const validateState = <T>(state: ValidationState<T>, fields: UiFormState<T>): void => {
  const { value, isValid, update } = getFormBaseState(fields)
  const isNowValid = state.validate(value, fields)
  if (isValid !== isNowValid) {
    update({ isValid: isNowValid })
  }
}

/**
 * `validate` contains functions creating often-sed {@link Validator} instances.
 */
const validate = Object.freeze({
  /**
   * Validate that the field value is not `null` or `undefined`.
   *
   * @param options.message A custom error message.
   * @param options Optional configuration options.
   */
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

  /**
   * Validate that the field value is not `null` or `undefined`,
   * and that its length is greater than 0.
   *
   * @param options.message A custom error message.
   * @param options.allowNull Whether `null` and `undefined` should be seen as valid values.
   * @param options Optional configuration options.
   */
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

  /**
   * Validate that the field value is not `null` or `undefined`, or an empty string.
   *
   * @param options.message A custom error message.
   * @param options.allowNull Whether `null` and `undefined` should be seen as valid values.
   * @param options Optional configuration options.
   */
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

  /**
   * Validate that the field value matches a specific regular expression.
   *
   * @param pattern The regex to match against.
   * @param options.message A custom error message.
   * @param options Optional configuration options.
   */
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

  /**
   * Validate that the field value has a specific minimal length.
   *
   * @param min The minimal length.
   * @param options.message A custom error message.
   * @param options Optional configuration options.
   */
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

  /**
   * Validate that the field value has a specific maximal length.
   *
   * @param max The maximal length.
   * @param options.message A custom error message.
   * @param options Optional configuration options.
   */
  maxLength: <T, V extends { length: number } | null | undefined>(
    max: number, options: { message?: string } = {}
  ): Validator<T, V> => (value) => {
    const {
      message = `darf maximal ${max} Zeichen lang sein`,
    } = options
    if (value != null && value.length > max) {
      return message
    }
    return true
  },
})
export default validate

/**
 * `ValidationState` described the current validation state for a nested value.
 */
class ValidationState<T> {
  /**
   * The previously validated value.
   * @private
   */
  private previousValue: T

  /**
   * Whether the previous validation was successful.
   * Is `undefined` if the first validation has not been executed yet.
   * @private
   */
  private previousResult: boolean | undefined

  /**
   * A mapping of field name to validators.
   * @private
   */
  private readonly validators = {} as Record<keyof T, Array<Validator<T, T[keyof T]>>>

  /**
   * A mapping of field name to nested validator.
   * @private
   */
  private readonly nestedStates = new Map<keyof T, ValidationState<T[keyof T]>>()

  /**
   * Creates a new {@link ValidationState}.
   *
   * @param initialValue The fields value, before its being validated.
   * @param validators The validation config for the value.
   */
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

  /**
   * Validates a nested value.
   *
   * @param value The value to validate.
   * @param form The form providing the value.
   */
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

  /**
   * Validates a non-nested field value.
   *
   * @param value The value to validate.
   * @param fieldName The field's name.
   * @param field The field's form state.
   */
  private validateValue = <K extends keyof T>(value: T, fieldName: K, field: UiFormStateField<T, K>): boolean => {
    if (field.skipNextValidation) {
      field.update({
        skipNextValidation: false,
      })
      return field.errors.length === 0
    }
    const fieldValidators = this.validators[fieldName]
    if (field.update === undefined) {
      if (fieldValidators.length === 0) {
        // The value is a nested object with an empty validator array.
        // This means that that object should not get validated.
        return true
      }
      // The value is a nested object, and it has at least one validator.
      // Validating in such a way is not currently supported,
      // as there's nowhere to store possible errors.
      throw new Error(`direction validation of nested objects is not supported: ${fieldName}`)
    }

    const fieldValue = value[fieldName]
    const errors = [] as string[]
    for (const validate of fieldValidators) {
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
