package ch.rfobaden.incidentmanager.backend.controllers;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.rfobaden.incidentmanager.backend.controllers.base.AppControllerTest;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.WithMockAgent;
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
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Optional;
import java.util.stream.Collectors;

@WebMvcTest(AssignmentController.class)
class AssignmentControllerTest extends AppControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    TransportService transportService;

    @MockBean
    ReportService reportService;

    @MockBean
    TaskService taskService;

    @MockBean
    SubtaskService subtaskService;

    @Autowired
    ModelGenerator<User> userGenerator;

    @Autowired
    ModelGenerator<Transport> transportGenerator;

    @Autowired
    ModelGenerator<Report> reportGenerator;

    @Autowired
    ModelGenerator<Task> taskGenerator;

    @Autowired
    ModelGenerator<Subtask> subtaskGenerator;

    ObjectMapper mapper = Jackson2ObjectMapperBuilder.json().build();

    @MockBean(name = "auth")
    AuthService authService;

    @Test
    @WithMockAgent
    void testListAllAssignments() throws Exception {
        // Given
        var user = userGenerator.generate();
        var amount = 10;
        var transports = transportGenerator.generate(amount);
        for (int i = 0; i < Math.random() * (amount - 1) + 1; i++) {
            transports.get(i).setAssignee(user);
        }
        var reports = reportGenerator.generate(amount);
        for (int i = 0; i < Math.random() * (amount - 1) + 1; i++) {
            reports.get(i).setAssignee(user);
        }
        var tasks = taskGenerator.generate(amount);
        for (int i = 0; i < Math.random() * (amount - 1) + 1; i++) {
            tasks.get(i).setAssignee(user);
        }
        var subtasks = subtaskGenerator.generate(amount);
        for (int i = 0; i < Math.random() * (amount - 1) + 1; i++) {
            subtasks.get(i).setAssignee(user);
        }

        var assignedTransports = transports.stream()
            .filter(e -> e.getAssignee() == user)
            .collect(Collectors.toList());
        var assignedReports = reports.stream()
            .filter(e -> e.getAssignee() == user)
            .collect(Collectors.toList());
        var assignedTasks = tasks.stream()
            .filter(e -> e.getAssignee() == user)
            .collect(Collectors.toList());
        var assignedSubtasks = subtasks.stream()
            .filter(e -> e.getAssignee() == user)
            .collect(Collectors.toList());

        Mockito.when(transportService.listWhereAssigneeId(user.getId()))
            .thenReturn(assignedTransports);
        Mockito.when(reportService.listWhereAssigneeId(user.getId()))
            .thenReturn(assignedReports);
        Mockito.when(taskService.listWhereAssigneeId(user.getId()))
            .thenReturn(assignedTasks);
        Mockito.when(subtaskService.listWhereAssigneeId(user.getId()))
            .thenReturn(assignedSubtasks);

        Mockito.when(authService.getCurrentUser())
            .thenReturn(Optional.of(user));
        Mockito.when(authService.isCurrentUser(user.getId()))
            .thenReturn(true);

        // When
        var mockRequest = MockMvcRequestBuilders
            .get("/api/v1/assignments")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(
                new AssignmentController.AssignmentsData(
                    assignedTransports,
                    assignedReports,
                    assignedTasks,
                    assignedSubtasks
                )
            ));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists());
        verify(transportService, times(1)).listWhereAssigneeId(user.getId());
        verify(reportService, times(1)).listWhereAssigneeId(user.getId());
        verify(taskService, times(1)).listWhereAssigneeId(user.getId());
        verify(subtaskService, times(1)).listWhereAssigneeId(user.getId());
    }
}
