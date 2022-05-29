package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.WebSecurityConfig;
import ch.rfobaden.incidentmanager.backend.controllers.base.AppController;
import ch.rfobaden.incidentmanager.backend.controllers.base.filters.JwtAuthFilter;
import ch.rfobaden.incidentmanager.backend.controllers.data.SessionData;
import ch.rfobaden.incidentmanager.backend.controllers.helpers.SessionHelper;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.services.AuthService;
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

/**
 * {@code SessionController} exposes endpoints to manage user sessions.
 * <p>
 *     Sessions are stateless, and represented via JWT tokens.
 *     The token is sent back to client when creating a new session in two ways:
 *     as httpOnly cookie and as field in the response body.
 *     The client may choose if it wishes to persists the cookie,
 *     or wants to attach an Authorization-Header containing the bearer token.
 * </p>
 *
 * @see SessionHelper
 * @see JwtAuthFilter
 * @see WebSecurityConfig
 */
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

    /**
     * Loads the current session.
     * Returns an empty body if there is no active session.
     *
     * @return The current session.
     */
    @GetMapping
    public SessionData find() {
        return authService.getSession()
            // Making this a 404 (or any other 4XX) would be preferable,
            // but many browsers show these errors in the console, which we do not want
            // to happen if we just want to check if the user is logged in.
            .orElse(null);
    }

    /**
     * Creates a new session.
     * Returns both a {@link SessionData} and attaches an httpOnly cookie to the response.
     *
     * @param data The login data.
     * @param response The http response.
     * @return The newly created session.
     *
     * @throws ApiException {@link HttpStatus#FORBIDDEN} if the user exists,
     *                      but is disabled or locked.
     *                      {@link HttpStatus#UNAUTHORIZED} if the login data is invalid.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SessionData create(
        @RequestBody LoginData data,
        HttpServletResponse response
    ) {
        var user = authenticate(data);
        return sessionHelper.addSessionToResponse(response, user);
    }

    /**
     * Deletes the session cookie, if it exists.
     *
     * @param response The http response.
     */
    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(HttpServletResponse response) {
        sessionHelper.deleteSessionFromResponse(response);
    }

    /**
     * Authenticates a user.
     *
     * @param data The login data.
     * @return The authenticated user.
     */
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

    /**
     * {@code LoginData} represents the data required to create a new session.
     */
    @Validated
    public static final class LoginData {
        /**
         * The login email.
         */
        @Email
        @NotBlank
        private String email;

        /**
         * The login password.
         */
        @NotBlank
        private String password;

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
    }
}
