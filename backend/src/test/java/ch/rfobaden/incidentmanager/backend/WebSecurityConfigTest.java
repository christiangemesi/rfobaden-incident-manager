package ch.rfobaden.incidentmanager.backend;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.catchThrowable;

import ch.rfobaden.incidentmanager.backend.controllers.base.handlers.ApiExceptionHandler;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import ch.rfobaden.incidentmanager.backend.test.generators.UserGenerator;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@SpringBootTest
@Import({
    TestConfig.class,
})
class WebSecurityConfigTest {
    @Autowired
    WebSecurityConfig config;

    @Autowired
    Faker faker;

    @MockBean
    ApiExceptionHandler exceptionHandler;

    @MockBean
    UserService userService;

    @Autowired
    UserGenerator userGenerator;

    @Test
    void testAuthEntryPoint_commence() throws IOException {
        // Given
        var req = new MockHttpServletRequest();
        var res = new MockHttpServletResponse();
        var e = new BadCredentialsException(faker.witcher().quote());

        var status = faker.random().nextInt(200, 599);
        var resEntity = ResponseEntity.status(status).body(
            new ApiExceptionHandler.ErrorResponse(e.getMessage())
        );

        Mockito.when(exceptionHandler.handle(e))
            .thenReturn(resEntity);

        var authEntryPoint = new WebSecurityConfig.AuthEntryPoint(exceptionHandler);

        // When
        authEntryPoint.commence(req, res, e);

        // Then
        assertThat(res.getStatus()).isEqualTo(status);
        assertThat(res.getContentType()).isEqualTo(MediaType.APPLICATION_JSON.toString());
    }

    @RepeatedTest(5)
    void testDetailsWrapperService_loadUserByUsername() {
        // Given
        var user = userGenerator.generate();
        Mockito.when(userService.findByEmail(user.getEmail()))
            .thenReturn(Optional.of(user));

        var service = new WebSecurityConfig.DetailsWrapperService(userService);

        // When
        var details = service.loadUserByUsername(user.getEmail());

        // Then
        assertThat(details.getUser()).isSameAs(user);
        assertThat(details.getAuthorities()).isEqualTo(
            List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
        assertThat(details.getUsername()).isEqualTo(user.getEmail());
        assertThat(details.getPassword()).isEqualTo(user.getCredentials().getEncryptedPassword());
        assertThat(details.isAccountNonExpired()).isTrue();
        assertThat(details.isAccountNonLocked()).isTrue();
        assertThat(details.isCredentialsNonExpired()).isTrue();
        assertThat(details.isEnabled()).isTrue();
    }

    @Test
    void testDetailsWrapperService_loadUserByUsername_notFound() {
        // Given
        var user = userGenerator.generate();
        Mockito.when(userService.findByEmail(user.getEmail()))
            .thenReturn(Optional.empty());

        var service = new WebSecurityConfig.DetailsWrapperService(userService);

        // When
        var result = catchThrowable(() -> service.loadUserByUsername(user.getEmail()));

        // Then
        assertThat(result)
            .isNotNull()
            .isInstanceOf(UsernameNotFoundException.class)
            .hasMessage("No user with email " + user.getEmail() + " found");
    }
}
