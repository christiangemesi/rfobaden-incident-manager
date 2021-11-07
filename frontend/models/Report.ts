import Model from '@/models/base/Model'
import Id from '@/models/base/Id'
import User from '@/models/User'

export default interface Report extends Model {
  title: string
  description: string
  assigneeId: Id<User>

}