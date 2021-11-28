
export interface UiInputProps<T> {
  value?: T
  onChange?: (value: T) => void
  errors?: string[]
}
