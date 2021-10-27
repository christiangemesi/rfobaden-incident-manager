export const parseDate = (date: unknown): Date => {
    const [year, month, day] = date as [number,number,number]
    return new Date(year, month, day)
}
