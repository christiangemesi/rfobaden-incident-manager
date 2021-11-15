package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelControllerTest;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import com.github.javafaker.Faker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.TestPropertySource;

@WebMvcTest(UserController.class)
@TestPropertySource(properties = "app.mock-user-service=false")
public class UserControllerTest extends ModelControllerTest<User, UserService> {
    @Autowired
    protected Faker faker;

    public UserControllerTest() {
        super("/api/v1/users/");
    }

//    @Test
//    public void testUpdatePassword() throws Exception {
//        // Given
//        var user = generator.generatePersisted();
//        var session = new Session(user.getId());
//        var newPassword = faker.internet().password();
//        Mockito.when(service.find(user.getId()))
//            .thenReturn(Optional.of(user));
//        Mockito.when(service.updatePassword(user, newPassword))
//            .thenReturn(Optional.of(user));
//
//        // When
//        var mockRequest = MockMvcRequestBuilders.put("/api/v1/users/current/password")
//            .contentType(MediaType.APPLICATION_JSON)
//            .accept(MediaType.APPLICATION_JSON)
//            .cookie(new Cookie(COOKIE_NAME, tokenHelper.encode(session)))
//            .content(mapper.writeValueAsString(new UserController.PasswordData(newPassword)));
//
//        // Then
//        mockMvc.perform(mockRequest)
//            .andExpect(status().isOk())
//            .andExpect(jsonPath("$").exists())
//            .andExpect(cookie().exists(COOKIE_NAME))
//            .andExpect(content().json(mapper.writeValueAsString(user)));
//        verify(service, times(1)).updatePassword(user, newPassword);
//    }
}
