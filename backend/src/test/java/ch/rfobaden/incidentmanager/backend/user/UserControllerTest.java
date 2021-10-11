package ch.rfobaden.incidentmanager.backend.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
public class UserControllerTest {
    @Autowired
    MockMvc mockMvc;
    @Autowired
    ObjectMapper mapper;

    @MockBean
    UserService userService;

    private final User USER1 = new User(1, "user1", "password1");
    private final User USER2 = new User(2, "user2", "password2");
    private final User USER3 = new User(3, "user3", "password3");

    @Test
    public void testGetAllUsers() throws Exception {
        // Given
        List<User> users = new ArrayList<>(Arrays.asList(USER1, USER2, USER3));

        // When
        Mockito.when(userService.getUsers()).thenReturn(users);
        MockHttpServletRequestBuilder mockRequest = MockMvcRequestBuilders.get("/api/v1/users");

        // Then
        mockMvc.perform(mockRequest)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[2].username", is("user3")));
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
                .andExpect(status().isNoContent())
                .andExpect(jsonPath("$").doesNotExist());
    }

    @Test
    public void testGetUserById() throws Exception {
        // Given
        long userId = 2;

        // When
        Mockito.when(userService.getUserById(userId)).thenReturn(Optional.of(USER2));
        MockHttpServletRequestBuilder mockRequest = MockMvcRequestBuilders.get("/api/v1/users/" + userId);

        // Then
        mockMvc.perform(mockRequest)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.id", is(2)))
                .andExpect(jsonPath("$.username", is("user2")));
    }

    @Test
    public void testGetUserByIdNotFound() throws Exception {
        // Given
        long userId = 4;

        // When
        Mockito.when(userService.getUserById(userId)).thenReturn(Optional.empty());
        MockHttpServletRequestBuilder mockRequest = MockMvcRequestBuilders.get("/api/v1/users/" + userId);

        // Then
        mockMvc.perform(mockRequest)
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$").doesNotExist());
    }

    @Test
    public void testGetUserByIdNull() throws Exception {
        // Given
        Long userId = null;

        // When
        Mockito.when(userService.getUserById(userId)).thenReturn(Optional.empty());
        MockHttpServletRequestBuilder mockRequest = MockMvcRequestBuilders.get("/api/v1/users/" + userId);

        // Then
        mockMvc.perform(mockRequest)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$").doesNotExist());
    }
}
