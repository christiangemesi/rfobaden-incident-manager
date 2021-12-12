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
}
