package ch.rfobaden.incidentmanager.backend.controllers;

import static ch.rfobaden.incidentmanager.backend.controllers.helpers.SessionCookieHelper.COOKIE_NAME;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.rfobaden.incidentmanager.backend.TestConfig;
import ch.rfobaden.incidentmanager.backend.models.Session;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import ch.rfobaden.incidentmanager.backend.services.encryption.BcryptEncryptionService;
import ch.rfobaden.incidentmanager.backend.test.generators.SessionGenerator;
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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Optional;
import javax.servlet.http.Cookie;

@WebMvcTest(SessionController.class)
@Import(TestConfig.class)
public class SessionControllerTest {
    @Autowired
    protected MockMvc mockMvc;

    @MockBean
    protected UserService userService;

    @MockBean
    protected BcryptEncryptionService encryptionService;

    @Autowired
    SessionGenerator sessionGenerator;

    @Autowired
    UserGenerator userGenerator;

    protected ObjectMapper mapper = Jackson2ObjectMapperBuilder.json().build();

    @Test
    public void testFind() throws Exception {
        // Given
        var user = userGenerator.generatePersisted();
        var session = new Session(user.getId());
        var sessionCookie = new Cookie(COOKIE_NAME, Session.encode(session));

        Mockito.when(userService.find(user.getId()))
            .thenReturn(Optional.of(user));

        // When
        var mockRequest = MockMvcRequestBuilders.get("/api/v1/session")
            .accept(MediaType.APPLICATION_JSON)
            .cookie(sessionCookie);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(content().json(mapper.writeValueAsString(user)));
        verify(userService, times(1)).find(user.getId());
    }

    @Test
    public void testFind_noSessionCookie() throws Exception {
        // When
        var mockRequest = MockMvcRequestBuilders.get("/api/v1/session")
            .accept(MediaType.APPLICATION_JSON);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message").value("no active session"));
    }

    @Test
    public void testFind_userNotFound() throws Exception {
        // Given
        var session = sessionGenerator.generate();
        var sessionCookie = new Cookie(COOKIE_NAME, Session.encode(session));

        Mockito.when(userService.find(session.getUserId()))
            .thenReturn(Optional.empty());

        // When
        var mockRequest = MockMvcRequestBuilders.get("/api/v1/session")
            .accept(MediaType.APPLICATION_JSON)
            .cookie(sessionCookie);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message").value("no active session"));
        verify(userService, times(1)).find(session.getUserId());
    }


    @Test
    public void testFind_invalidCookie() throws Exception {
        // Given
        var sessionCookie = new Cookie(COOKIE_NAME, "Session was the Impostor");

        // When
        var mockRequest = MockMvcRequestBuilders.get("/api/v1/session")
            .accept(MediaType.APPLICATION_JSON)
            .cookie(sessionCookie);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message").value("no active session"));
    }

    private void testCreate(String url, MockRequestPerformer performer) throws Exception {
        // Given
        var user = userGenerator.generatePersisted();

        var requestData = new SessionController.LoginData();
        requestData.setEmail(user.getEmail());
        requestData.setPassword("i swear this is correct");

        Mockito.when(userService.findByEmail(user.getEmail()))
            .thenReturn(Optional.of(user));
        Mockito.when(encryptionService.matches(
            requestData.getPassword(),
            user.getCredentials().getEncryptedPassword()
        )).thenReturn(true);


        // When
        var mockRequest = MockMvcRequestBuilders.post(url + "/api/v1/session")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(requestData));

        // Then
        performer.perform(mockRequest)
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$").exists())
            .andExpect(cookie().exists(COOKIE_NAME))
            .andExpect(cookie().maxAge(COOKIE_NAME, -1))
            .andExpect(cookie().path(COOKIE_NAME, "/api/v1/"))
            .andExpect(cookie().httpOnly(COOKIE_NAME, true))
            .andExpect(content().json(mapper.writeValueAsString(user)));
        verify(userService, times(1)).findByEmail(user.getEmail());
        verify(encryptionService, times(1)).matches(
            requestData.getPassword(),
            user.getCredentials().getEncryptedPassword()
        );
    }

    @Test
    public void testCreate_insecure() throws Exception {
        testCreate("http://localhost", (mockRequest) -> (
            mockMvc.perform(mockRequest)
                .andExpect(cookie().domain(COOKIE_NAME, "localhost"))
                .andExpect(cookie().secure(COOKIE_NAME, false))
        ));
    }

    @Test
    public void testCreate_secure() throws Exception {
        testCreate("https://localhost", (mockRequest) -> (
            mockMvc.perform(mockRequest)
                .andExpect(cookie().domain(COOKIE_NAME, "localhost"))
                .andExpect(cookie().secure(COOKIE_NAME, true))
        ));
    }

    @Test
    public void testCreate_subDomain() throws Exception {
        testCreate("https://my.sub.domain", (mockRequest) -> (
            mockMvc.perform(mockRequest)
                .andExpect(cookie().domain(COOKIE_NAME, "my.sub.domain"))
        ));
    }

    @Test
    public void testCreate_www() throws Exception {
        testCreate("https://www.domain", (mockRequest) -> (
            mockMvc.perform(mockRequest)
                .andExpect(cookie().domain(COOKIE_NAME, "domain"))
        ));
    }

    @Test
    public void testCreate_wwwSubDomain() throws Exception {
        testCreate("https://www.my.sub.domain", (mockRequest) -> (
            mockMvc.perform(mockRequest)
                .andExpect(cookie().domain(COOKIE_NAME, "my.sub.domain"))
        ));
    }

    @Test
    public void testCreate_persistent() throws Exception {
        // Given
        var user = userGenerator.generatePersisted();

        var requestData = new SessionController.LoginData();
        requestData.setEmail(user.getEmail());
        requestData.setPassword("i swear this is correct");
        requestData.setPersistent(true);

        Mockito.when(userService.findByEmail(user.getEmail()))
            .thenReturn(Optional.of(user));
        Mockito.when(encryptionService.matches(
            requestData.getPassword(),
            user.getCredentials().getEncryptedPassword()
        )).thenReturn(true);


        // When
        var mockRequest = MockMvcRequestBuilders.post("/api/v1/session")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(requestData));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$").exists())
            .andExpect(cookie().exists(COOKIE_NAME))
            .andExpect(cookie().maxAge(COOKIE_NAME, 315_569_520))
            .andExpect(cookie().path(COOKIE_NAME, "/api/v1/"))
            .andExpect(cookie().httpOnly(COOKIE_NAME, true))
            .andExpect(content().json(mapper.writeValueAsString(user)));
        verify(userService, times(1)).findByEmail(user.getEmail());
        verify(encryptionService, times(1)).matches(
            requestData.getPassword(),
            user.getCredentials().getEncryptedPassword()
        );
    }

    @Test
    public void testCreate_unknownEmail() throws Exception {
        // Given
        var user = userGenerator.generatePersisted();

        var requestData = new SessionController.LoginData();
        requestData.setEmail(user.getEmail());
        requestData.setPassword("Doesn't really matter to me, to me");

        Mockito.when(userService.findByEmail(user.getEmail()))
            .thenReturn(Optional.empty());
        Mockito.when(encryptionService.matches(
                requestData.getPassword(),
                user.getCredentials().getEncryptedPassword()
        )).thenReturn(true);

        // When
        var mockRequest = MockMvcRequestBuilders.post("/api/v1/session")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(requestData));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message").value("invalid username or password"));
        verify(userService, times(1)).findByEmail(user.getEmail());
    }

    @Test
    public void testCreate_wrongPassword() throws Exception {
        // Given
        var user = userGenerator.generatePersisted();

        var requestData = new SessionController.LoginData();
        requestData.setEmail(user.getEmail());
        requestData.setPassword("fake it till you make it");

        Mockito.when(userService.findByEmail(user.getEmail()))
            .thenReturn(Optional.of(user));
        Mockito.when(encryptionService.matches(
            requestData.getPassword(),
            user.getCredentials().getEncryptedPassword()
        )).thenReturn(false);

        // When
        var mockRequest = MockMvcRequestBuilders.post("/api/v1/session")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(requestData));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message").value("invalid username or password"));
        verify(userService, times(1)).findByEmail(user.getEmail());
        verify(encryptionService, times(1)).matches(
            requestData.getPassword(),
            user.getCredentials().getEncryptedPassword()
        );
    }

    @Test
    public void testDelete() throws Exception {
        // Given
        var user = userGenerator.generatePersisted();
        var session = new Session(user.getId());
        var sessionCookie = new Cookie(COOKIE_NAME, Session.encode(session));

        Mockito.when(userService.find(user.getId()))
            .thenReturn(Optional.of(user));

        // When
        var mockRequest = MockMvcRequestBuilders.delete("/api/v1/session")
            .accept(MediaType.APPLICATION_JSON)
            .cookie(sessionCookie);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNoContent())
            .andExpect(cookie().maxAge(COOKIE_NAME, 0));
        verify(userService, times(1)).find(user.getId());
    }

    @Test
    public void testDelete_noSessionCookie() throws Exception {
        // When
        var mockRequest = MockMvcRequestBuilders.delete("/api/v1/session")
            .accept(MediaType.APPLICATION_JSON);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message").value("no active session"));
    }

    @Test
    public void testDelete_userNotFound() throws Exception {
        // Given
        var session = sessionGenerator.generate();
        var sessionCookie = new Cookie(COOKIE_NAME, Session.encode(session));

        Mockito.when(userService.find(session.getUserId()))
            .thenReturn(Optional.empty());

        // When
        var mockRequest = MockMvcRequestBuilders.delete("/api/v1/session")
            .accept(MediaType.APPLICATION_JSON)
            .cookie(sessionCookie);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message").value("no active session"));
        verify(userService, times(1)).find(session.getUserId());
    }


    @Test
    public void testDelete_invalidCookie() throws Exception {
        // Given
        var sessionCookie = new Cookie(COOKIE_NAME, "Session was the Impostor");

        // When
        var mockRequest = MockMvcRequestBuilders.delete("/api/v1/session")
            .accept(MediaType.APPLICATION_JSON)
            .cookie(sessionCookie);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message").value("no active session"));
    }

    @FunctionalInterface
    private interface MockRequestPerformer {
        ResultActions perform(RequestBuilder mockRequest) throws Exception;
    }
}
