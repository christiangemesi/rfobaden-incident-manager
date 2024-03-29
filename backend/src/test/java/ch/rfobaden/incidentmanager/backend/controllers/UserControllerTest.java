package ch.rfobaden.incidentmanager.backend.controllers;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
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
import ch.rfobaden.incidentmanager.backend.services.UserService;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Optional;

@WebMvcTest(UserController.class)
@TestPropertySource(properties = "app.mock-user-service=false")
class UserControllerTest extends ModelControllerTest.Basic<User, UserService> {
    @Autowired
    Faker faker;

    @MockBean
    OrganizationService organizationService;

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
    void testResetPassword() throws Exception {
        // Given
        var user = generator.generate();
        var newPassword = faker.internet().password();

        Mockito.when(service.find(user.getId()))
            .thenReturn(Optional.of(user));
        Mockito.when(service.resetPassword(user.getId()))
            .thenReturn(Optional.of(user));

        Mockito.when(authService.isCurrentUser(user.getId()))
            .thenReturn(true);

        // When
        var mockRequest = MockMvcRequestBuilders.post("/api/v1/users/" + user.getId() + "/reset")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists());
        verify(service, times(1)).resetPassword(user.getId());
    }
}
