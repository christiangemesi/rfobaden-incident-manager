/**
 * `Priority` represents how important a specific entity is.
 */
enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}
export default Priority

/**
 * Map the priority to its index.
 * The index can be used to sort priorities from most to least important.
 *
 * @param priority The priority .
 * @return The priority's index.
 */
export const getPriorityIndex = (priority: Priority): number => {
  switch (priority) {
  case Priority.HIGH:
    return 2
  case Priority.MEDIUM:
    return 1
  case Priority.LOW:
    return 0
  }
}
