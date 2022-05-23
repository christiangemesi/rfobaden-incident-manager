package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.AppController;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.RequireAgent;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.services.AuthService;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import ch.rfobaden.incidentmanager.backend.services.SubtaskService;
import ch.rfobaden.incidentmanager.backend.services.TaskService;
import ch.rfobaden.incidentmanager.backend.services.TransportService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * {@code AssignmentController} implements endpoints to give access to the assignments of a user.
 */
@RestController
@RequestMapping(path = "api/v1/assignments")
public class AssignmentController extends AppController {
    private final TransportService transportService;
    private final ReportService reportService;
    private final TaskService taskService;
    private final SubtaskService subtaskService;
    private final AuthService authService;
    public AssignmentController(
        TransportService transportService,
        ReportService reportService,
        TaskService taskService,
        SubtaskService subtaskService,
        AuthService authService
    ) {
        this.transportService = transportService;
        this.reportService = reportService;
        this.taskService = taskService;
        this.subtaskService = subtaskService;
        this.authService = authService;
    }

    /**
     * Lists all {@link AssignmentsData assignments}.
     * <p>
     *     An assignment contains all {@link Transport transports},
     *     {@link Report reports}, {@link Task tasks} and
     *     {@link Subtask subtasks} assigned to the current
     *     {@link User user}.
     * </p>
     *
     * @return The assignments.
     */
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @RequireAgent
    public AssignmentsData listAllAssignments() {
        var userId = authService.getCurrentUser().orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "user not found")
        )).getId();

        return new AssignmentsData(
            transportService.listWhereAssigneeId(userId),
            reportService.listWhereAssigneeId(userId),
            taskService.listWhereAssigneeId(userId),
            subtaskService.listWhereAssigneeId(userId)
        );
    }

    /**
     * {@code AssignmentsData} contains of a list of each assignable entity
     * from all opened {@link Incident incidents}.
     */
    public static final class AssignmentsData {
        /**
         * List of assigned {@link Transport transports}.
         */
        private List<Transport> transports;

        /**
         * List of assigned {@link Report reports}.
         */
        private List<Report> reports;

        /**
         * List of assigned {@link Task tasks}.
         */
        private List<Task> tasks;

        /**
         * List of assigned {@link Subtask subtasks}.
         */
        private List<Subtask> subtasks;

        public AssignmentsData() {
        }

        public AssignmentsData(
            List<Transport> transports,
            List<Report> reports,
            List<Task> tasks,
            List<Subtask> subtasks
        ) {
            this.transports = transports;
            this.reports = reports;
            this.tasks = tasks;
            this.subtasks = subtasks;
        }

        public List<Transport> getTransports() {
            return transports;
        }

        public List<Report> getReports() {
            return reports;
        }

        public List<Task> getTasks() {
            return tasks;
        }

        public List<Subtask> getSubtasks() {
            return subtasks;
        }
    }
}
