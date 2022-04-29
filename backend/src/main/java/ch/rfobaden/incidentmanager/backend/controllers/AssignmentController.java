package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.AppController;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.RequireAgent;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.services.AuthService;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(path = "api/v1/assignments")
public class AssignmentController extends AppController {
    private final UserService userService;

    private final AuthService authService;

    public AssignmentController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @GetMapping("/transports")
    @ResponseStatus(HttpStatus.OK)
    @RequireAgent
    public List<Transport> findAssignedTransports() {
        var user = authService.getCurrentUser().orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "user not found")
        ));

        return new ArrayList<>(userService.findAllAssignedTransports(user));
    }

    @GetMapping("/reports")
    @ResponseStatus(HttpStatus.OK)
    @RequireAgent
    public List<Report> findAssignedReports() {
        var user = authService.getCurrentUser().orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "user not found")
        ));

        return new ArrayList<>(userService.findAllAssignedReports(user));
    }

    @GetMapping("/tasks")
    @ResponseStatus(HttpStatus.OK)
    @RequireAgent
    public List<Task> findAssignedTasks() {
        var user = authService.getCurrentUser().orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "user not found")
        ));

        return new ArrayList<>(userService.findAllAssignedTasks(user));
    }

    @GetMapping("/subtasks")
    @ResponseStatus(HttpStatus.OK)
    @RequireAgent
    public List<Subtask> findAssignedSubtasks() {
        var user = authService.getCurrentUser().orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "user not found")
        ));

        return new ArrayList<>(userService.findAllAssignedSubtasks(user));
    }
}
