import Model from '@/models/base/Model'
import User from '@/models/User'
import Id from '@/models/base/Id'

export default interface Task extends Model {
  title: string
  description: string | null
  priority: string
  location: string | null

  assigneeId: Id<User> | null

  createdAt: Date
  updatedAt: Date
  closedAt: Date | null

  startsAt: Date | null
  endsAt: Date | null

  reportId: number
  incidentId: number
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}
