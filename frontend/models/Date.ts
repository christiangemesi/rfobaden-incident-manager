export const parseDate = (date: unknown): Date => {
    const [year, month, day, hours, minutes, seconds, ms] = date as [number, number, number, number, number, number, number]
    return new Date(year, month, day, hours, minutes,seconds,ms)
}
