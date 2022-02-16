enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}
export default Priority

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