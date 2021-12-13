package ch.rfobaden.incidentmanager.backend.controllers;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.rfobaden.incidentmanager.backend.WebSecurityConfig;
import ch.rfobaden.incidentmanager.backend.controllers.base.AppControllerTest;
import ch.rfobaden.incidentmanager.backend.controllers.helpers.JwtHelper;
import ch.rfobaden.incidentmanager.backend.controllers.helpers.JwtHelperTest;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import ch.rfobaden.incidentmanager.backend.test.generators.UserGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.List;
import java.util.Optional;

@WebMvcTest(SessionController.class)
@TestPropertySource(properties = "app.mock-user-service=false")
public class SessionControllerTest extends AppControllerTest {
    @Autowired
    protected MockMvc mockMvc;

    @MockBean
    protected AuthenticationManager authManager;

    @MockBean
    protected UserService userService;

    @Autowired
    protected JwtHelper jwtHelper;

    @Autowired
    UserGenerator userGenerator;

    protected ObjectMapper mapper = Jackson2ObjectMapperBuilder.json().build();

    @Test
    public void testFind() throws Exception {
        // Given
        var user = userGenerator.generate();
        var token = jwtHelper.encodeUser(user);

        Mockito.when(userService.find(user.getId()))
            .thenReturn(Optional.of(user));

        // When
        var mockRequest = MockMvcRequestBuilders.get("/api/v1/session")
            .accept(MediaType.APPLICATION_JSON)
            .header("Authorization", "Bearer " + token);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(content().json(mapper.writeValueAsString(
                new SessionController.SessionData(token, user)
            )));
        verify(userService, times(1)).find(user.getId());
    }

    @Test
    public void testFind_noToken() throws Exception {
        // When
        var mockRequest = MockMvcRequestBuilders.get("/api/v1/session")
            .accept(MediaType.APPLICATION_JSON);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(content().json(mapper.writeValueAsString(
                new SessionController.SessionData(null, null)
            )));
    }

    @Test
    public void testCreate() throws Exception {
        // Given
        var user = userGenerator.generate();

        var requestData = new SessionController.LoginData();
        requestData.setEmail(user.getEmail());
        requestData.setPassword("i swear this is correct");

        var auth = new UsernamePasswordAuthenticationToken(
            requestData.getEmail(),
            requestData.getPassword()
        );
        Mockito.when(authManager.authenticate(auth))
            .thenReturn(new UsernamePasswordAuthenticationToken(
                new WebSecurityConfig.DetailsWrapper(user),
                null,
                List.of()
            ));

        // When
        var mockRequest = MockMvcRequestBuilders.post("/api/v1/session")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(requestData));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.token").isString())
            .andExpect(jsonPath("$.user").isMap())
            .andExpect(jsonPath("$.user.id").value(user.getId()));
        verify(authManager, times(1)).authenticate(auth);
    }

    @Test
    public void testCreate_disabledUser() throws Exception {
        // Given
        var user = userGenerator.generate();

        var requestData = new SessionController.LoginData();
        requestData.setEmail(user.getEmail());
        requestData.setPassword("i swear this is correct");

        var auth = new UsernamePasswordAuthenticationToken(
            requestData.getEmail(),
            requestData.getPassword()
        );

        Mockito.when(authManager.authenticate(auth))
            .thenThrow(new DisabledException("..."));

        // When
        var mockRequest = MockMvcRequestBuilders.post("/api/v1/session")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(requestData));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isForbidden())
            .andExpect(jsonPath("$.message").exists())
            .andExpect(jsonPath("$.message").value("user is disabled"));
        verify(authManager, times(1)).authenticate(auth);
    }

    @Test
    public void testCreate_lockedUser() throws Exception {
        // Given
        var user = userGenerator.generate();

        var requestData = new SessionController.LoginData();
        requestData.setEmail(user.getEmail());
        requestData.setPassword("i swear this is correct");

        var auth = new UsernamePasswordAuthenticationToken(
            requestData.getEmail(),
            requestData.getPassword()
        );

        Mockito.when(authManager.authenticate(auth))
            .thenThrow(new LockedException("..."));

        // When
        var mockRequest = MockMvcRequestBuilders.post("/api/v1/session")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(requestData));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isForbidden())
            .andExpect(jsonPath("$.message").exists())
            .andExpect(jsonPath("$.message").value("user is locked"));
        verify(authManager, times(1)).authenticate(auth);
    }

    @Test
    public void testCreate_badCredentials() throws Exception {
        // Given
        var user = userGenerator.generate();

        var requestData = new SessionController.LoginData();
        requestData.setEmail(user.getEmail());
        requestData.setPassword("i swear this is correct");

        var auth = new UsernamePasswordAuthenticationToken(
            requestData.getEmail(),
            requestData.getPassword()
        );

        Mockito.when(authManager.authenticate(auth))
            .thenThrow(new BadCredentialsException("..."));

        // When
        var mockRequest = MockMvcRequestBuilders.post("/api/v1/session")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(requestData));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.message").exists())
            .andExpect(jsonPath("$.message").value("invalid username or password"));
        verify(authManager, times(1)).authenticate(auth);
    }
}
