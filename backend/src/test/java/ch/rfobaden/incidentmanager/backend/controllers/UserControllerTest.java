package ch.rfobaden.incidentmanager.backend.controllers;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelControllerTest;
import ch.rfobaden.incidentmanager.backend.models.Organization;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.services.UserService;
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
public class UserControllerTest extends ModelControllerTest.Basic<User, UserService> {
    @Autowired
    Faker faker;

    @MockBean
    UserService userService;

    //TODO red when in
    //@Override
    protected void mockRelations(Organization organization, EmptyPath path) {
        var user = organization.getUser();
        if (user != null) {
            Mockito.when(userService.find(user.getId()))
                .thenReturn(Optional.of(user));
        }
    }

    @Override
    protected String getEndpointFor(EmptyPath path) {
        return "/api/v1/users/";
    }

    @Test
    public void testUpdatePassword() throws Exception {
        // Given
        var user = generator.generate();
        var newPassword = faker.internet().password();

        Mockito.when(service.find(user.getId()))
            .thenReturn(Optional.of(user));
        Mockito.when(service.updatePassword(user.getId(), newPassword))
            .thenReturn(Optional.of(user));

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
}
