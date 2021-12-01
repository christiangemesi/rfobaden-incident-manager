package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.repos.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksOfReports(Long reportId) {
        return taskRepository.findAllOfReport(reportId);
    }

    public Optional<Task> getTaskById(Long taskId) {
        return taskRepository.findById(taskId);
    }

    public Optional<Task> getTaskOfReportById(Long reportId, Long taskId) {
        return taskRepository.findByIdOfReport(reportId, taskId);
    }

    public Task addNewTask(Task task) {
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    public Optional<Task> updateTask(Long id, Task task) {
        var persistentTask = getTaskById(id).orElse(null);
        if (persistentTask == null) {
            return Optional.empty();
        }

        if (task.getId() != null && !Objects.equals(task.getId(), id)) {
            throw new IllegalArgumentException("can't update task id");
        }
        task.setId(id);
        task.setAuthor(persistentTask.getAuthor());

        task.setReport(persistentTask.getReport());
        task.setCreatedAt(persistentTask.getCreatedAt());
        task.setUpdatedAt(LocalDateTime.now());
        return Optional.of(taskRepository.save(task));
    }

    public boolean deleteTaskById(Long taskId) {
        if (taskRepository.existsById(taskId)) {
            taskRepository.deleteById(taskId);
            return true;
        }
        return false;
    }
}
