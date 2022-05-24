package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.paths.TaskPath;
import ch.rfobaden.incidentmanager.backend.repos.TaskRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import ch.rfobaden.incidentmanager.backend.services.notifications.NotificationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService extends ModelRepositoryService<Task, TaskPath, TaskRepository> {
    private final NotificationService notificationService;

    public TaskService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Override
    protected void afterSave(Task oldTask, Task task) {
        notificationService.notifyAssigneeIfChanged(oldTask, task);
    }

    /**
     * Loads all assigned {@link Task tasks} over all opened {@link Incident incidents}.
     *
     * @param id The id of the {@link User assignee}.
     * @return The list of assigned tasks.
     */
    public List<Task> listWhereAssigneeId(Long id) {
        return repository.findAllByAssigneeId(id);
    }
}
