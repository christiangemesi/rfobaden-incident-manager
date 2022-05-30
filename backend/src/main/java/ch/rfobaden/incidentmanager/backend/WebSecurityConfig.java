package ch.rfobaden.incidentmanager.backend;

import ch.rfobaden.incidentmanager.backend.controllers.base.filters.ExceptionHandlerFilter;
import ch.rfobaden.incidentmanager.backend.controllers.base.filters.JwtAuthFilter;
import ch.rfobaden.incidentmanager.backend.controllers.base.handlers.ApiExceptionHandler;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * {@code WebSecurityConfig} configures elements of Spring security.
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    private final JwtAuthFilter authFilter;

    private final ExceptionHandlerFilter expectionHandlerFiler;

    private final DetailsWrapperService detailsWrapperService;

    private final PasswordEncoder passwordEncoder;

    private final AuthEntryPoint authEntryPoint;

    public WebSecurityConfig(
        JwtAuthFilter authFilter,
        ExceptionHandlerFilter expectionHandlerFiler,
        UserService userService,
        ApiExceptionHandler exceptionHandler,
        PasswordEncoder passwordEncoder
    ) {
        this.authFilter = authFilter;
        this.expectionHandlerFiler = expectionHandlerFiler;
        this.authEntryPoint = new AuthEntryPoint(exceptionHandler);
        this.passwordEncoder = passwordEncoder;
        this.detailsWrapperService = new DetailsWrapperService(userService);
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
            // The service loading authorization users.
            .userDetailsService(detailsWrapperService)

            // Encoder for user passwords.
            .passwordEncoder(passwordEncoder);
    }

    @Override
    public void configure(
        AuthenticationManagerBuilder authenticationManagerBuilder
    ) throws Exception {
        authenticationManagerBuilder
            // The service loading authorization users.
            .userDetailsService(detailsWrapperService)

            // Encoder for user passwords.
            .passwordEncoder(passwordEncoder);
    }

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
            // Enable cors, as the API runs on a different host than the frontend.
            .cors()

            // Disable csrf.
            .and().csrf().disable()

            // Permit all requests by default,
            // as we authorize them using annotations.
            .authorizeRequests().anyRequest().permitAll()
            .and().exceptionHandling().authenticationEntryPoint(authEntryPoint)

            // make sure we use stateless session.
            // session won't be used to store user's state.
            .and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // Add a filter to validate the tokens with every request
        httpSecurity
            .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(expectionHandlerFiler, authFilter.getClass());
    }

    @Bean
    public AuthenticationManager getAuthenticationManager() throws Exception {
        return authenticationManagerBean();
    }

    /**
     * {@code AuthEntryPoint} is an {@link AuthenticationEntryPoint} that
     * handles our custom exceptions.
     */
    public static class AuthEntryPoint implements AuthenticationEntryPoint {
        private final ApiExceptionHandler exceptionHandler;

        public AuthEntryPoint(ApiExceptionHandler exceptionHandler) {
            this.exceptionHandler = exceptionHandler;
        }

        @Override
        public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException e
        ) throws IOException {
            var data = exceptionHandler.handle(e);
            response.setStatus(data.getStatusCodeValue());
            response.setHeader("Content-Type", MediaType.APPLICATION_JSON.toString());
            response.getWriter().write(new ObjectMapper().writeValueAsString(data.getBody()));
        }
    }

    /**
     * {@code DetailsWrapperService} is a {@link UserDetailsService}
     * that wraps a {@link UserService}.
     */
    public static class DetailsWrapperService implements UserDetailsService {
        private final UserService userService;

        public DetailsWrapperService(UserService userService) {
            this.userService = userService;
        }

        @Override
        public DetailsWrapper loadUserByUsername(String username) throws UsernameNotFoundException {
            var user = userService.findByEmail(username).orElseThrow(() -> (
                new UsernameNotFoundException("No user with email " + username + " found")
            ));
            return new DetailsWrapper(user);
        }
    }

    /**
     * {@code DetailsWrapper} is a {@link UserDetails} that wraps a {@link User}.
     */
    public static class DetailsWrapper implements UserDetails {
        private final User user;

        public DetailsWrapper(User user) {
            this.user = user;
        }

        public User getUser() {
            return user;
        }

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        }

        @Override
        public String getPassword() {
            return user.getCredentials().getEncryptedPassword();
        }

        @Override
        public String getUsername() {
            return user.getEmail();
        }

        @Override
        public boolean isAccountNonExpired() {
            return true;
        }

        @Override
        public boolean isAccountNonLocked() {
            return true;
        }

        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }

        @Override
        public boolean isEnabled() {
            return true;
        }
    }
}
