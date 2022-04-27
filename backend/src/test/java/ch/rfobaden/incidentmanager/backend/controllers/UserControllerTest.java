package ch.rfobaden.incidentmanager.backend.controllers;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelControllerTest;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.services.AuthService;
import ch.rfobaden.incidentmanager.backend.services.OrganizationService;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import ch.rfobaden.incidentmanager.backend.services.SubtaskService;
import ch.rfobaden.incidentmanager.backend.services.TaskService;
import ch.rfobaden.incidentmanager.backend.services.TransportService;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Optional;
import java.util.stream.Collectors;

@WebMvcTest(UserController.class)
@TestPropertySource(properties = "app.mock-user-service=false")
class UserControllerTest extends ModelControllerTest.Basic<User, UserService> {
    @Autowired
    Faker faker;

    @MockBean
    OrganizationService organizationService;

    @Autowired
    ModelGenerator<Transport> transportGenerator;

    @Autowired
    ModelGenerator<Report> reportGenerator;

    @Autowired
    ModelGenerator<Task> taskGenerator;

    @Autowired
    ModelGenerator<Subtask> subtaskGenerator;

    @MockBean(name = "auth")
    AuthService authService;

    @Override
    protected String getEndpointFor(EmptyPath path) {
        return "/api/v1/users/";
    }

    @Override
    protected void mockRelations(EmptyPath path, User user) {
        var organization = user.getOrganization();
        if (organization != null) {
            Mockito.when(organizationService.find(organization.getId()))
                .thenReturn(Optional.of(organization));
        }
    }

    @Test
    void testUpdatePassword() throws Exception {
        // Given
        var user = generator.generate();
        var newPassword = faker.internet().password();

        Mockito.when(service.find(user.getId()))
            .thenReturn(Optional.of(user));
        Mockito.when(service.updatePassword(user.getId(), newPassword))
            .thenReturn(Optional.of(user));

        Mockito.when(authService.isCurrentUser(user.getId()))
            .thenReturn(true);

        // When
        var mockRequest = MockMvcRequestBuilders.put("/api/v1/users/" + user.getId() + "/password")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(new UserController.PasswordData(newPassword)));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists());
        verify(service, times(1)).updatePassword(user.getId(), newPassword);
    }

    @Test
    void testFindAssignedTransports() throws Exception {
        // Given
        var user = generator.generate();
        var amount = 10;
        var transports = transportGenerator.generate(amount);
        for (int i = 0; i < Math.random() * (amount - 1) + 1; i++) {
            transports.get(i).setAssignee(user);
        }
        var assignedTransports = transports.stream()
            .filter(e -> e.getAssignee() == user)
            .collect(Collectors.toList());

        Mockito.when(service.find(user.getId()))
            .thenReturn(Optional.of(user));
        Mockito.when(service.findAllAssignedTransports(user))
            .thenReturn(assignedTransports);

        Mockito.when(authService.isCurrentUser(user.getId()))
            .thenReturn(true);

        // When
        var mockRequest = MockMvcRequestBuilders
            .get("/api/v1/users/" + user.getId() + "/assignments/transports")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(assignedTransports));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists());
        verify(service, times(1)).findAllAssignedTransports(user);
    }
    @Test
    void testFindAssignedReports() throws Exception {
        // Given
        var user = generator.generate();
        var amount = 10;
        var reports = reportGenerator.generate(amount);
        for (int i = 0; i < Math.random() * (amount - 1) + 1; i++) {
            reports.get(i).setAssignee(user);
        }
        var assignedReports = reports.stream()
            .filter(e -> e.getAssignee() == user)
            .collect(Collectors.toList());

        Mockito.when(service.find(user.getId()))
            .thenReturn(Optional.of(user));
        Mockito.when(service.findAllAssignedReports(user))
            .thenReturn(assignedReports);

        Mockito.when(authService.isCurrentUser(user.getId()))
            .thenReturn(true);

        // When
        var mockRequest = MockMvcRequestBuilders
            .get("/api/v1/users/" + user.getId() + "/assignments/reports")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(assignedReports));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists());
        verify(service, times(1)).findAllAssignedReports(user);
    }
    @Test
    void testFindAssignedTasks() throws Exception {
        // Given
        var user = generator.generate();
        var amount = 10;
        var tasks = taskGenerator.generate(amount);
        for (int i = 0; i < Math.random() * (amount - 1) + 1; i++) {
            tasks.get(i).setAssignee(user);
        }
        var assignedTasks = tasks.stream()
            .filter(e -> e.getAssignee() == user)
            .collect(Collectors.toList());

        Mockito.when(service.find(user.getId()))
            .thenReturn(Optional.of(user));
        Mockito.when(service.findAllAssignedTasks(user))
            .thenReturn(assignedTasks);

        Mockito.when(authService.isCurrentUser(user.getId()))
            .thenReturn(true);

        // When
        var mockRequest = MockMvcRequestBuilders
            .get("/api/v1/users/" + user.getId() + "/assignments/tasks")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(assignedTasks));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists());
        verify(service, times(1)).findAllAssignedTasks(user);
    }
    @Test
    void testFindAssignedSubtasks() throws Exception {
        // Given
        var user = generator.generate();
        var amount = 10;
        var subtasks = subtaskGenerator.generate(amount);
        for (int i = 0; i < Math.random() * (amount - 1) + 1; i++) {
            subtasks.get(i).setAssignee(user);
        }
        var assignedSubtasks = subtasks.stream()
            .filter(e -> e.getAssignee() == user)
            .collect(Collectors.toList());

        Mockito.when(service.find(user.getId()))
            .thenReturn(Optional.of(user));
        Mockito.when(service.findAllAssignedSubtasks(user))
            .thenReturn(assignedSubtasks);

        Mockito.when(authService.isCurrentUser(user.getId()))
            .thenReturn(true);

        // When
        var mockRequest = MockMvcRequestBuilders
            .get("/api/v1/users/" + user.getId() + "/assignments/subtasks")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(assignedSubtasks));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists());
        verify(service, times(1)).findAllAssignedSubtasks(user);
    }
}
