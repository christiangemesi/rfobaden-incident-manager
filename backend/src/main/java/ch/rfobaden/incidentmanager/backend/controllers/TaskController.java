package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.models.paths.TaskPath;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import ch.rfobaden.incidentmanager.backend.services.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/v1/incidents/{incidentId}/reports/{reportId}/tasks")
public class TaskController extends ModelController<Task, TaskPath, TaskService> {

    private final ReportService reportService;

    public TaskController(ReportService reportService) {
        this.reportService = reportService;
    }

    @Override
    public Task create(@ModelAttribute TaskPath path, @RequestBody Task task) {
        task.setAuthor(requireCurrentUser());
        return super.create(path, task);
    }

    @Override
    protected void loadPath(TaskPath path, Task task) {
        var report = reportService.getReportById(path.getReportId()).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "report not found")
        ));
        task.setReport(report);
    }
}
