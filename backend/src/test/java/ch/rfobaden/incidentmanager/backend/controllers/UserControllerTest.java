package ch.rfobaden.incidentmanager.backend.controllers;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import ch.rfobaden.incidentmanager.backend.util.UserSerializerNoId;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.List;
import java.util.Optional;

@WebMvcTest(UserController.class)
public class UserControllerTest {
    @Autowired
    MockMvc mockMvc;

    @MockBean
    UserService userService;

    ObjectMapper requestMapper = new ObjectMapper();

    private final User user1 = new User(1, "user1", "password1");
    private final User user2 = new User(2, "user2", "password2");
    private final User user3 = new User(3, "user3", "password3");

    {
        // Add module to requestMapper which maps user without ids.
        SimpleModule module = new SimpleModule();
        module.addSerializer(User.class, new UserSerializerNoId());
        requestMapper.registerModule(module);
    }

    @Test
    public void testGetAllUsers() throws Exception {
        // Given
        List<User> users = List.of(user1, user2, user3);
        Mockito.when(userService.getUsers())
            .thenReturn(users);

        // When
        var request = MockMvcRequestBuilders.get("/api/v1/users");

        // Then
        mockMvc.perform(request)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$", hasSize(users.size())))
                .andExpect(jsonPath("$[2].username", is(users.get(2).getUsername())));
        verify(userService, times(1)).getUsers();
    }

    @Test
    public void testGetAllUsersEmpty() throws Exception {
        // Given
        Mockito.when(userService.getUsers())
            .thenReturn(List.of());

        // When
        var mockRequest = MockMvcRequestBuilders.get("/api/v1/users");

        // Then
        mockMvc.perform(mockRequest)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
        verify(userService, times(1)).getUsers();
    }

    @Test
    public void testGetUserById() throws Exception {
        // Given
        var user = user2;
        Mockito.when(userService.getUserById(user.getId()))
            .thenReturn(Optional.of(user));

        // When
        var mockRequest = MockMvcRequestBuilders.get("/api/v1/users/" + user.getId());

        // Then
        mockMvc.perform(mockRequest)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.id", is(user.getId()), Long.class))
                .andExpect(jsonPath("$.username", is(user.getUsername())))
                .andExpect(jsonPath("$.password", is(user.getPassword())));
        verify(userService, times(1)).getUserById(user.getId());
    }

    @Test
    public void testGetUserByIdNotFound() throws Exception {
        // Given
        long userId = 4;
        Mockito.when(userService.getUserById(userId))
            .thenReturn(Optional.empty());

        // When
        var mockRequest = MockMvcRequestBuilders.get("/api/v1/users/" + userId);

        // Then
        mockMvc.perform(mockRequest)
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.message", is("user not found")));
        verify(userService, times(1)).getUserById(userId);
    }

    @Test
    public void testAddNewUser() throws Exception {
        // Given
        User newUser = new User("newUser", "newPassword");
        User createdUser = new User(4, newUser.getUsername(), newUser.getPassword());
        Mockito.when(userService.addNewUser(newUser))
            .thenReturn(createdUser);

        // When
        var mockRequest = MockMvcRequestBuilders.post("/api/v1/users/")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(requestMapper.writeValueAsString(newUser));

        // Then
        mockMvc.perform(mockRequest)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.id", is(createdUser.getId()), Long.class))
                .andExpect(jsonPath("$.username", is(newUser.getUsername())))
                .andExpect(jsonPath("$.password", is(newUser.getPassword())));
        verify(userService, times(1)).addNewUser(newUser);
    }

    @Test
    public void testDeleteUserById() throws Exception {
        // Given
        long userId = 2;
        Mockito.when(userService.deleteUserById(userId))
            .thenReturn(true);

        // When
        MockHttpServletRequestBuilder mockRequest =
            MockMvcRequestBuilders.delete("/api/v1/users/" + userId);

        // Then
        mockMvc.perform(mockRequest)
                .andExpect(status().isNoContent())
                .andExpect(jsonPath("$").doesNotExist());
        verify(userService, times(1)).deleteUserById(userId);
    }

    @Test
    public void testDeleteUserByIdNotFound() throws Exception {
        // Given
        long userId = 4;
        Mockito.when(userService.deleteUserById(userId))
            .thenReturn(false);

        // When
        MockHttpServletRequestBuilder mockRequest =
            MockMvcRequestBuilders.delete("/api/v1/users/" + userId);

        // Then
        mockMvc.perform(mockRequest)
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.message", is("user not found")));
        verify(userService, times(1)).deleteUserById(userId);
    }
}
