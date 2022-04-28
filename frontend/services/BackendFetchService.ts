import Task, { parseTask } from '@/models/Task'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Subtask, { parseSubtask } from '@/models/Subtask'
import SubtaskStore from '@/stores/SubtaskStore'
import TaskStore from '@/stores/TaskStore'
import Report from '@/models/Report'

class BackendFetchService {
  async loadTasksOfReport(report: Report): Promise<Task[]> {
    const [data, error]: BackendResponse<Task[]> = await BackendService.list(
      `incidents/${report.incidentId}/reports/${report.id}/tasks`,
    )
    if (error !== null) {
      throw error
    }
    const tasks = data.map(parseTask)
    TaskStore.saveAll(tasks)
    return tasks
  }

  async loadSubtasksOfTask(task: Task): Promise<Subtask[]> {
    const [data, error]: BackendResponse<Subtask[]> = await BackendService.list(
      `incidents/${task.incidentId}/reports/${task.reportId}/tasks/${task.id}/subtasks`,
    )
    if (error !== null) {
      throw error
    }
    const subtasks = data.map(parseSubtask)
    SubtaskStore.saveAll(subtasks)
    return subtasks
  }
}
export default new BackendFetchService()
