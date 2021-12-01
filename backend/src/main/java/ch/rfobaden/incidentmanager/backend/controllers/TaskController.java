package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.AppController;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import ch.rfobaden.incidentmanager.backend.services.TaskService;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/incidents/{incidentId}/reports/{reportId}/tasks")
public class TaskController extends AppController {

    private final TaskService taskService;

    private final ReportService reportService;

    private final UserService userService;

    public TaskController(
        TaskService taskService,
        ReportService reportService,
        UserService userService
    ) {
        this.taskService = taskService;
        this.reportService = reportService;
        this.userService = userService;
    }

    @GetMapping
    public List<Task> getTasks(@PathVariable("reportId") Long reportId) {
        if (reportService.getReportById(reportId).isEmpty()) {
            throw new IllegalArgumentException("report not found");
        }
        return taskService.getTasksOfReports(reportId);
    }

    @GetMapping("{taskId}")
    public Task getTaskById(
        @PathVariable("reportId") long reportId,
        @PathVariable("taskId") long taskId
    ) {
        return taskService.getTaskOfReportById(reportId, taskId).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "task not found")
        ));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task addNewTask(
        @PathVariable("reportId") Long reportId,
        @RequestBody Task task
    ) {
        task.setAuthor(getCurrentUser().orElseThrow(() -> (
            new ApiException(HttpStatus.UNAUTHORIZED, "not signeds in")
        )));
        prepareTask(task, reportId);
        return taskService.addNewTask(task);
    }

    @PutMapping("{taskId}")
    @ResponseStatus(HttpStatus.OK)
    public Task updateTask(
        @PathVariable("reportId") Long reportId,
        @PathVariable("taskId") Long taskId,
        @RequestBody Task task
    ) {
        prepareTask(task, reportId);
        return taskService.updateTask(taskId, task).orElseThrow(() ->
            (new ApiException(HttpStatus.NOT_FOUND, "task not found")));
    }

    @DeleteMapping("{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTaskById(
        @PathVariable("reportId") Long reportId,
        @PathVariable("taskId") Long taskId
    ) {
        taskService.getTaskOfReportById(reportId, taskId).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "task not found")
        ));
        if (!taskService.deleteTaskById(taskId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "task not found");
        }
    }

    private void prepareTask(Task task, Long reportId) {
        task.setReport(reportService.getReportById(reportId).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "incident not found")
        )));
        if (task.getAssigneeId() != null) {
            task.setAssignee(userService.find(task.getAssigneeId()).orElseThrow(() -> (
                new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "assignee not found")
            )));
        }
    }
}
