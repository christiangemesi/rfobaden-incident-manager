package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.paths.SubtaskPath;
import ch.rfobaden.incidentmanager.backend.services.SubtaskService;
import ch.rfobaden.incidentmanager.backend.services.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/v1/incidents/{incidentId}/reports/{reportId}/tasks/{taskId}/subtasks")
public class SubtaskController extends ModelController<Subtask, SubtaskPath, SubtaskService> {

    private final TaskService taskService;

    public SubtaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @Override
    protected void loadRelations(SubtaskPath path, Subtask subtask) {
        var task = taskService.find(path, path.getTaskId()).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "task not found")
        ));
        subtask.setTask(task);
    }
}
