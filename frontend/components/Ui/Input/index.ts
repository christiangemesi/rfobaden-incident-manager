
export interface UiInputProps<T> {
  /**
   * The current value.
   */
  value: T

  /**
   * Event caused by input value being changed.
   */
  onChange: (value: T) => void

  /**
   * Errors caused by validating {@link value}.
   */
  errors?: string[]
}
