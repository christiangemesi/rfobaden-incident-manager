package ch.rfobaden.incidentmanager.backend.services;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.catchThrowable;

import ch.rfobaden.incidentmanager.backend.TestConfig;
import ch.rfobaden.incidentmanager.backend.test.generators.UserGenerator;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;

import java.util.List;
import java.util.function.Supplier;

@SpringBootTest
@Import({
    TestConfig.class,
    AuthServiceTest.SecurityContextMock.class,
})
public class AuthServiceTest {
    @Autowired
    UserGenerator userGenerator;

    @Autowired
    AuthService service;

    @Autowired
    SecurityContextMock securityContextMock;

    @Test
    void testGetCurrentUser() {
        // Given
        var user = userGenerator.generate();
        securityContextMock.mockAuth(user);

        // Then
        var result = service.getCurrentUser().orElse(null);

        // Then
        assertThat(result)
            .isNotNull()
            .isEqualTo(user);
    }

    @Test
    void testGetCurrentUser_noAuthorization() {
        // Given
        securityContextMock.mockAuth(null);

        // Then
        var result = service.getCurrentUser();

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    void testGetCurrentUser_unknownPrincipal() {
        // Given
        var principal = new Object();
        securityContextMock.mockAuth(principal);


        // Then
        var result = service.getCurrentUser();

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    void testRequireCurrentUser() {
        // Given
        var user = userGenerator.generate();
        securityContextMock.mockAuth(user);

        // Then
        var result = service.requireCurrentUser();

        // Then
        assertThat(result)
            .isNotNull()
            .isEqualTo(user);
    }

    @Test
    void testRequireCurrentUser_noCurrentUser() {
        // Given
        securityContextMock.mockAuth(null);

        // Then
        var result = catchThrowable(() -> service.requireCurrentUser());

        // Then
        assertThat(result)
            .isInstanceOf(IllegalStateException.class)
            .hasMessage("can't require current user, not authenticated");
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
