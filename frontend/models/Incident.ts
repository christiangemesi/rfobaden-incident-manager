import Model from '@/models/base/Model'
import User from './User';

export default interface Incident extends Model {
    title: string
    creator: User
    creationDate: Date
    changeDate: Date
    startDate: Date
    endDate: Date
    description: string
    status: string
    closeReason: string
}
