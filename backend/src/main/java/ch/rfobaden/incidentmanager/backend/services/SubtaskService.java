package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.models.paths.SubtaskPath;
import ch.rfobaden.incidentmanager.backend.models.paths.TaskPath;
import ch.rfobaden.incidentmanager.backend.repos.SubtaskRepository;
import ch.rfobaden.incidentmanager.backend.repos.TaskRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import ch.rfobaden.incidentmanager.backend.utils.validation.Violations;
import org.springframework.stereotype.Service;

@Service
public class SubtaskService
    extends ModelRepositoryService<Subtask, SubtaskPath, SubtaskRepository> {

    private final UserService userService;

    public SubtaskService(UserService userService) {
        this.userService = userService;
    }

    @Override
    protected void loadRelations(Subtask subtask, Violations violations) {
        if (subtask.getAssignee() != null) {
            userService.find(subtask.getAssignee().getId()).ifPresentOrElse(subtask::setAssignee, () ->
                violations.add("assignee", "does not exist")
            );
        }
    }
}
