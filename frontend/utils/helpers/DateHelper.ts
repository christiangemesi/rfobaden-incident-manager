
class DateHelper {
  isMidnight(date: Date): boolean {
    return date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0
  }

  /**
   * Checks if a date range consists only of full days.
   * This is true if the range starts and ends at midnight.
   *
   * @param start The start of the range.
   * @param end The end of the range. Optional if the range is open.
   */
  isDayRange(start: Date, end?: Date | null): boolean {
    return this.isMidnight(start) && (end == null || this.isMidnight(end))
  }
}
export default new DateHelper()
