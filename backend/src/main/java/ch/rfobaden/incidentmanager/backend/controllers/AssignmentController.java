package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.AppController;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(path = "api/v1/assignments")
public class AssignmentController extends AppController {
    private final UserService userService;

    public AssignmentController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/transports/{userId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("@auth.isCurrentUser(#userId)")
    public List<Transport> findAssignedTransports(@PathVariable("userId") Long userId) {
        var user = userService.find(userId).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "user not found")
        ));

        return new ArrayList<>(userService.findAllAssignedTransports(user));
    }

    @GetMapping("/reports/{userId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("@auth.isCurrentUser(#userId)")
    public List<Report> findAssignedReports(@PathVariable("userId") Long userId) {
        var user = userService.find(userId).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "user not found")
        ));

        return new ArrayList<>(userService.findAllAssignedReports(user));
    }

    @GetMapping("/tasks/{userId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("@auth.isCurrentUser(#userId)")
    public List<Task> findAssignedTasks(@PathVariable("userId") Long userId) {
        var user = userService.find(userId).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "user not found")
        ));

        return new ArrayList<>(userService.findAllAssignedTasks(user));
    }

    @GetMapping("/subtasks/{userId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("@auth.isCurrentUser(#userId)")
    public List<Subtask> findAssignedSubtasks(@PathVariable("userId") Long userId) {
        var user = userService.find(userId).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "user not found")
        ));

        return new ArrayList<>(userService.findAllAssignedSubtasks(user));
    }
}
