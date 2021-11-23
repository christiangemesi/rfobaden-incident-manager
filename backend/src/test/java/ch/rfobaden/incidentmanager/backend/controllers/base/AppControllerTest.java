package ch.rfobaden.incidentmanager.backend.controllers.base;


import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.catchThrowable;

import ch.rfobaden.incidentmanager.backend.TestConfig;
import ch.rfobaden.incidentmanager.backend.WebConfig;
import ch.rfobaden.incidentmanager.backend.WebSecurityConfig;
import ch.rfobaden.incidentmanager.backend.controllers.helpers.JwtHelper;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import ch.rfobaden.incidentmanager.backend.test.generators.UserGenerator;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestComponent;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.MockBeans;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;

import java.util.List;
import java.util.function.Supplier;

@Import({
    TestConfig.class,
    WebConfig.class,
    WebSecurityConfig.class,
    JwtHelper.class,
    AppControllerTest.MockUserServiceConfig.class
})
public abstract class AppControllerTest {
    @Autowired
    protected UserService userService;

    /**
     * Tests for {@link AppController}, which do not have to be tested
     * for every subclass.
     */
    @SpringBootTest
    @Import({
        TestConfig.class,
        Local.LocalAppController.class,
        SecurityContextMock.class,
    })
    public static class Local {
        @Autowired
        public LocalAppController controller;

        @Autowired
        UserGenerator userGenerator;

        @Autowired
        SecurityContextMock securityContextMock;

        @Test
        public void testGetCurrentUser() {
            // Given
            var user = userGenerator.generate();
            securityContextMock.mockAuth(user);

            // Then
            var result = controller.getCurrentUser().orElse(null);

            // Then
            assertThat(result)
                .isNotNull()
                .isEqualTo(user);
        }

        @Test
        public void testGetCurrentUser_noAuthorization() {
            // Given
            securityContextMock.mockAuth(null);

            // Then
            var result = controller.getCurrentUser();

            // Then
            assertThat(result).isEmpty();
        }

        @Test
        public void testGetCurrentUser_unknownPrincipal() {
            // Given
            var principal = new Object();
            securityContextMock.mockAuth(principal);


            // Then
            var result = controller.getCurrentUser();

            // Then
            assertThat(result).isEmpty();
        }

        @Test
        public void testRequireCurrentUser() {
            // Given
            var user = userGenerator.generate();
            securityContextMock.mockAuth(user);

            // Then
            var result = controller.requireCurrentUser();

            // Then
            assertThat(result)
                .isNotNull()
                .isEqualTo(user);
        }

        @Test
        public void testRequireCurrentUser_noCurrentUser() {
            // Given
            securityContextMock.mockAuth(null);

            // Then
            var result = catchThrowable(() -> controller.requireCurrentUser());

            // Then
            assertThat(result)
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("can't require current user, not authenticated");
        }

        /**
         * Implementation of {@link AppController} for testing purposes.
         * Marked as component so dependency injection works.
         */
        @TestComponent
        public static final class LocalAppController extends AppController {}
    }

    @TestConfiguration
    @ConditionalOnProperty(value = "app.mock-user-service", matchIfMissing = true)
    public static class MockUserServiceConfig {
        // Required so the filter chain gets a UserService bean.
        // It doesn't matter that this mock does not actually do anything,
        // as long as the request does not contain auth details,
        // in which case the test method is responsible for correct mocking.
        @MockBean
        protected UserService userService;
    }

    @TestConfiguration
    public static class SecurityContextMock {
        SecurityContext securityContext = Mockito.mock(SecurityContext.class);

        @Bean
        @Primary
        public SecurityContext securityContext() {
            return securityContext;
        }

        @Bean
        @Primary
        public Supplier<SecurityContext> securityContextSupplier() {
            return () -> securityContext;
        }

        public void mockAuth(Object principal) {
            var auth = new UsernamePasswordAuthenticationToken(principal, null, List.of());
            Mockito.when(securityContext.getAuthentication())
                .thenReturn(auth);
        }
    }
}
