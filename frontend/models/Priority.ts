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
 *
 * @param priority The property.
 * @return The property's index.
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
