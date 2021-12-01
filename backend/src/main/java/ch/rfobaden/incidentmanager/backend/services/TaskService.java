package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.models.paths.TaskPath;
import ch.rfobaden.incidentmanager.backend.repos.TaskRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import ch.rfobaden.incidentmanager.backend.utils.validation.Violations;
import org.springframework.stereotype.Service;

@Service
public class TaskService extends ModelRepositoryService<Task, TaskPath, TaskRepository>  {

    private final UserService userService;

    public TaskService(UserService userService) {
        this.userService = userService;
    }

    @Override
    protected void loadRelations(Task task, Violations violations) {
        if (task.getAuthor() != null) {
            userService.find(task.getAuthor().getId()).ifPresentOrElse(task::setAuthor, () ->
                violations.add("author", "does not exist")
            );
        }
        if (task.getAssignee() != null) {
            userService.find(task.getAssignee().getId()).ifPresentOrElse(task::setAssignee, () ->
                violations.add("assignee", "does not exist")
            );
        }
    }
}
