package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.WebSecurityConfig;
import ch.rfobaden.incidentmanager.backend.controllers.base.AppController;
import ch.rfobaden.incidentmanager.backend.controllers.data.SessionData;
import ch.rfobaden.incidentmanager.backend.controllers.helpers.SessionHelper;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.services.AuthService;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@RestController
@Validated
@RequestMapping(path = "api/v1/session")
public class SessionController extends AppController {
    private final AuthenticationManager authManager;

    private final AuthService authService;

    private final SessionHelper sessionHelper;

    public SessionController(
        AuthenticationManager authManager,
        AuthService authService,
        SessionHelper sessionHelper
    ) {
        this.authManager = authManager;
        this.authService = authService;
        this.sessionHelper = sessionHelper;
    }

    @GetMapping
    public SessionData find() {
        return authService.getSession()
            // Making this a 404 (or any other 4XX) would be preferable,
            // but many browsers show these errors in the console, which we do not want
            // to happen if we just want to check if the user is logged in.
            .orElse(null);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SessionData create(
        @RequestBody LoginData data,
        HttpServletResponse response
    ) {
        var user = authenticate(data);
        return sessionHelper.addSessionToResponse(response, user);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(HttpServletResponse response) {
        sessionHelper.deleteSessionFromResponse(response);
    }

    private User authenticate(LoginData data) {
        try {
            var token = new UsernamePasswordAuthenticationToken(
                data.getEmail(),
                data.getPassword()
            );
            var auth = authManager.authenticate(token);
            return ((WebSecurityConfig.DetailsWrapper) auth.getPrincipal()).getUser();
        } catch (DisabledException e) {
            throw new ApiException(HttpStatus.FORBIDDEN, "user is disabled");
        } catch (LockedException e) {
            throw new ApiException(HttpStatus.FORBIDDEN, "user is locked");
        } catch (BadCredentialsException e) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "invalid username or password");
        }
    }

    @Validated
    public static final class LoginData {
        @Email
        @NotBlank
        private String email;

        @NotBlank
        private String password;

        private boolean isPersistent;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        @JsonProperty("isPersistent")
        public boolean isPersistent() {
            return isPersistent;
        }

        public void setPersistent(boolean persistent) {
            isPersistent = persistent;
        }
    }
}
