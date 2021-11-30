package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping(path = "api/v1/incidents/{incidentId}/reports/{reportId/tasks}")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PutMapping
    public List<Task> getTasks() {
        return taskService.getTasks();
    }

    @GetMapping("{taskId}")
    public Task getTaskById(@PathVariable("taskId") long taskId) {
        return taskService.getTaskById(taskId).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "task not found")
        ));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task addNewTask(@RequestBody Task task) {
        return taskService.addNewTask(task);
    }

    @PutMapping("{taskId}")
    @ResponseStatus(HttpStatus.OK)
    public Task updateTask(
        @PathVariable("taskId") Long taskId,
        @RequestBody Task task
    ) {
        return taskService.updateTask(taskId, task).orElseThrow(() ->
            (new ApiException(HttpStatus.NOT_FOUND, "task not found")));
    }

    @DeleteMapping("{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTaskById(@PathVariable("taskId") long taskId) {
        if (!taskService.deleteTaskById(taskId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "task not found");
        }
    }

}
