import Model from '@/models/base/Model'

export default interface Incident extends Model {
    title: string
    authorId: number
    description: string
    closeReason: string
    isClosed: boolean
    createdAt: Date
    updatedAt: Date
    startsAt: Date
    endsAt: Date
}
