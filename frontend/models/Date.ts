export const parseDate = (date: unknown): Date => {
  const [year, month, day, hours, minutes, seconds, ns] = date as [number, number, number, number, number, number, number]
  return new Date(Date.UTC(year, month - 1, day, hours ?? 0, minutes ?? 0, seconds ?? 0, ns == null ? 0 : ns / 1000000))
}
