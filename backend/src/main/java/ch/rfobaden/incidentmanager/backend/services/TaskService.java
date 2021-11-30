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

    public Optional<Task> getTaskById(Long taskId) {
        return taskRepository.findById(taskId);
    }

    public Task addNewTask(Task task) {
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    public Optional<Task> updateTask(Long taskId, Task task) {
        Task taskOfId = getTaskById(taskId).orElse(null);
        if (taskOfId == null) {
            return Optional.empty();
        }
        if (task.getId() == null) {
            task.setId(taskId);
        } else if (!Objects.equals(task.getId(), taskId)) {
            throw new IllegalArgumentException("body id differs from parameter id");
        }
        task.setCreatedAt((taskOfId.getCreatedAt()));
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
