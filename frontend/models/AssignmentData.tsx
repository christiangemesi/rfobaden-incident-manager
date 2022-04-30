import Task from '@/models/Task'
import Transport from '@/models/Transport'
import Subtask from '@/models/Subtask'
import Report from '@/models/Report'

export default interface AssignmentData {
  transports: Transport[]
  reports: Report[]
  tasks: Task[]
  subtasks: Subtask[]
}