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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@WebMvcTest(UserController.class)
public class UserControllerTest {
    @Autowired
    MockMvc mockMvc;
    @Autowired
    ObjectMapper mapper;

    SimpleModule module = new SimpleModule();

    @MockBean
    UserService userService;

    private final User user1 = new User(1, "user1", "password1");
    private final User user2 = new User(2, "user2", "password2");
    private final User user3 = new User(3, "user3", "password3");

    @Test
    public void testGetAllUsers() throws Exception {
        // Given
        List<User> users = new ArrayList<>(Arrays.asList(user1, user2, user3));

        // When
        Mockito.when(userService.getUsers()).thenReturn(users);
        MockHttpServletRequestBuilder mockRequest = MockMvcRequestBuilders.get("/api/v1/users");

        // Then
        mockMvc.perform(mockRequest)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[2].username", is("user3")));
        verify(userService, times(1)).getUsers();
    }

    @Test
    public void testGetAllUsersEmpty() throws Exception {
        // Given
        List<User> users = new ArrayList<>();

        // When
        Mockito.when(userService.getUsers()).thenReturn(users);
        MockHttpServletRequestBuilder mockRequest = MockMvcRequestBuilders.get("/api/v1/users");

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
        long userId = 2;

        // When
        Mockito.when(userService.getUserById(userId)).thenReturn(Optional.of(user2));
        MockHttpServletRequestBuilder mockRequest =
            MockMvcRequestBuilders.get("/api/v1/users/" + userId);

        // Then
        mockMvc.perform(mockRequest)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.id", is(2)))
                .andExpect(jsonPath("$.username", is("user2")));
        verify(userService, times(1)).getUserById(userId);
    }

    @Test
    public void testGetUserByIdNotFound() throws Exception {
        // Given
        long userId = 4;

        // When
        Mockito.when(userService.getUserById(userId))
            .thenReturn(Optional.empty());
        MockHttpServletRequestBuilder mockRequest =
            MockMvcRequestBuilders.get("/api/v1/users/" + userId);

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
        User createdUser = new User(4, "newUser", "newPassword");
        // Register custom mapper
        module.addSerializer(User.class, new UserSerializerNoId());
        mapper.registerModule(module);

        // When
        Mockito.when(userService.addNewUser(newUser)).thenReturn(createdUser);
        var mockRequest = MockMvcRequestBuilders.post("/api/v1/users/")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(this.mapper.writeValueAsString(newUser));

        // Then
        mockMvc.perform(mockRequest)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.id", is(4)))
                .andExpect(jsonPath("$.username", is("newUser")))
                .andExpect(jsonPath("$.password", is("newPassword")));
        verify(userService, times(1)).addNewUser(newUser);
    }

    @Test
    public void testDeleteUserById() throws Exception {
        // Given
        long userId = 2;

        // When
        Mockito.when(userService.deleteUserById(userId)).thenReturn(true);
        MockHttpServletRequestBuilder mockRequest =
            MockMvcRequestBuilders.delete("/api/v1/users/" + userId);

        // Then
        mockMvc.perform(mockRequest)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").doesNotExist());
        verify(userService, times(1)).deleteUserById(userId);
    }

    @Test
    public void testDeleteUserByIdNotFound() throws Exception {
        // Given
        long userId = 4;

        // When
        Mockito.when(userService.deleteUserById(userId)).thenReturn(false);
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
