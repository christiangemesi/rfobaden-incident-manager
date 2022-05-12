package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.RequireAgent;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.models.paths.TaskPath;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import ch.rfobaden.incidentmanager.backend.services.TaskService;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/v1/incidents/{incidentId}/reports/{reportId}/tasks")
public class TaskController extends ModelController<Task, TaskPath, TaskService> {

    private final ReportService reportService;

    private final UserService userService;

    public TaskController(
        ReportService reportService,
        UserService userService
    ) {
        this.reportService = reportService;
        this.userService = userService;
    }

    @Override
    @RequireAgent
    public Task create(@ModelAttribute TaskPath path, @RequestBody Task entity) {
        return super.create(path, entity);
    }

    @Override
    @RequireAgent
    public Task update(
        @ModelAttribute TaskPath path,
        @PathVariable Long id,
        @RequestBody Task entity
    ) {
        return super.update(path, id, entity);
    }

    @Override
    @RequireAgent
    public void delete(@ModelAttribute TaskPath path, @PathVariable Long id) {
        super.delete(path, id);
    }

    @Override
    protected void loadRelations(TaskPath path, Task task) {
        var report = reportService.find(path, path.getReportId()).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "report not found")
        ));
        task.setReport(report);

        if (task.getAssignee() != null) {
            var assignee = userService.find(task.getAssignee().getId()).orElseThrow(() -> (
                new ApiException(HttpStatus.NOT_FOUND, "assignee not found")
            ));
            task.setAssignee(assignee);
        }
    }
}
