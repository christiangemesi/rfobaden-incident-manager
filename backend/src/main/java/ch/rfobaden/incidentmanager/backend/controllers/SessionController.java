package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.WebSecurityConfig;
import ch.rfobaden.incidentmanager.backend.controllers.base.AppController;
import ch.rfobaden.incidentmanager.backend.controllers.helpers.JwtHelper;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@RestController
@Validated
@RequestMapping(path = "api/v1/session")
public class SessionController extends AppController {
    private final AuthenticationManager authManager;

    private final UserService userService;

    private final JwtHelper jwtHelper;

    public SessionController(
        AuthenticationManager authManager,
        UserService userService,
        JwtHelper jwtHelper) {
        this.authManager = authManager;
        this.userService = userService;
        this.jwtHelper = jwtHelper;
    }

    @GetMapping
    public SessionData find(HttpServletRequest request) {
        return getCurrentUser().map((user) -> {
            var token = request.getHeader("Authorization").substring(7);
            return new SessionData(token, user);
        }).orElseGet(() -> {
            // Making this a 404 (or any other 4XX) would be preferable,
            // but many browsers show these errors in the console, which we do not want
            // to happen if we just want to check if the user is logged in.
            return new SessionData(null, null);
        });
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SessionData create(
        @RequestBody LoginData data,
        HttpServletRequest request,
        HttpServletResponse response
    ) {
        var user = authenticate(data);
        var token = jwtHelper.encodeUser(user);
        return new SessionData(token, user);
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

    public static final class SessionData {
        private final String token;
        private final User user;

        public SessionData(String token, User user) {
            this.token = token;
            this.user = user;
        }

        @JsonInclude(JsonInclude.Include.NON_NULL)
        public String getToken() {
            return token;
        }

        public User getUser() {
            return user;
        }
    }
}
