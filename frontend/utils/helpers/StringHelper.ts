/**
 * `StringHelper` contains helper functions to work with {@code string} values.
 */
class StringHelper {
  /**
   * Converts the first character of a string to uppercase.
   *
   * @param value The string to capitalize.
   */
  capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
export default new StringHelper()
