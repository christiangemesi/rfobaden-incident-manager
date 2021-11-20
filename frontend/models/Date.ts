export const parseDate = (date: unknown): Date => {
  const [year, month, day, hours, minutes, seconds, ns] = date as [number, number, number, number, number, number, number]
  return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds, ns / 1000000))
}
