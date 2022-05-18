
export interface UiInputProps<T> {
  /**
   * Generic Parameter
   */
  value: T

  /**
   * Generic Parameter that switches from one state to another state
   */
  onChange: (value: T) => void

  /**
   * Array of Strings displaying errors
   */
  errors?: string[]
}
