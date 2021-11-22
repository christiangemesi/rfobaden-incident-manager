package ch.rfobaden.incidentmanager.backend;

import ch.rfobaden.incidentmanager.backend.controllers.filters.ExceptionHandlerFilter;
import ch.rfobaden.incidentmanager.backend.controllers.filters.JwtAuthFilter;
import ch.rfobaden.incidentmanager.backend.controllers.handlers.ApiExceptionHandler;
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

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    private final JwtAuthFilter authFilter;

    private final ExceptionHandlerFilter expectionHandlerFiler;

    private final UserService userService;

    private final DetailsWrapperService detailsWrapperService;

    private final ApiExceptionHandler exceptionHandler;

    private final PasswordEncoder passwordEncoder;

    public WebSecurityConfig(
        JwtAuthFilter authFilter,
        ExceptionHandlerFilter expectionHandlerFiler,
        UserService userService,
        ApiExceptionHandler exceptionHandler,
        PasswordEncoder passwordEncoder
    ) {
        this.authFilter = authFilter;
        this.expectionHandlerFiler = expectionHandlerFiler;
        this.userService = userService;
        this.exceptionHandler = exceptionHandler;
        this.passwordEncoder = passwordEncoder;
        this.detailsWrapperService = new DetailsWrapperService();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .userDetailsService(detailsWrapperService)
            .passwordEncoder(passwordEncoder);
    }

    @Override
    public void configure(
        AuthenticationManagerBuilder authenticationManagerBuilder
    ) throws Exception {
        authenticationManagerBuilder
            .userDetailsService(detailsWrapperService)
            .passwordEncoder(passwordEncoder);
    }

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
            .cors()
            .and().csrf().disable()

            // .authorizeRequests().antMatchers("/authenticate").permitAll().
            // all other requests need to be authenticated
            .authorizeRequests().anyRequest().permitAll()

            .and().exceptionHandling().authenticationEntryPoint(new AuthEntryPoint())

            // make sure we use stateless session; session won't be used to
            // store user's state.
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

    public class AuthEntryPoint implements AuthenticationEntryPoint {
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


    public class DetailsWrapperService implements UserDetailsService {
        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
            var user = userService.findByEmail(username).orElseThrow(() -> (
                new UsernameNotFoundException("No user with email " + username + " found")
            ));
            return new DetailsWrapper(user);
        }
    }

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
            return List.of();
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
