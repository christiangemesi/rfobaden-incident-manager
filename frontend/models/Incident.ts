import Model from '@/models/base/Model'
import { parseDate } from '@/models/Date'

export default interface Incident extends Model {
    title: string
    authorId: number
    description: string
    closeReason: string | null
    isClosed: boolean
    createdAt: Date
    updatedAt: Date
    startsAt: Date | null
    endsAt: Date | null
}

export const parseIncident = (data: unknown): Incident => {
    const incident = data as Incident
    return {
        ...incident,
        createdAt: parseIfNotNull(incident.createdAt),
        updatedAt: parseIfNotNull(incident.updatedAt),
        startsAt: parseIfNotNull(incident.startsAt),
        endsAt: parseIfNotNull(incident.endsAt),
    }
}

const parseIfNotNull = (date: Date | null): Date | null => {
    return date === null ? null : parseDate(date)
}