package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.helpers.SessionCookieHelper;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Session;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import ch.rfobaden.incidentmanager.backend.services.encryption.EncryptionService;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping(path = "api/v1/session")
public final class SessionController {
    private final SessionCookieHelper cookieHelper;

    private final UserService userService;

    private final EncryptionService encryptionService;

    public SessionController(
        SessionCookieHelper cookieHelper,
        UserService userService,
        EncryptionService encryptionService
    ) {
        this.cookieHelper = cookieHelper;
        this.userService = userService;
        this.encryptionService = encryptionService;
    }

    @GetMapping
    public User find(HttpServletRequest request) {
        var cookie = cookieHelper.findCookie(request);
        var session = cookieHelper.parseSessionFromCookie(cookie);
        return cookieHelper.findSessionUser(session);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User create(
        @RequestBody LoginData data,
        HttpServletRequest request,
        HttpServletResponse response
    ) {
        var user = userService.findByEmail(data.email).orElse(null);
        if (user == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "invalid username or password");
        }

        var encryptedPassword = user.getCredentials().getEncryptedPassword();
        if (!encryptionService.matches(data.password, encryptedPassword)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "invalid username or password");
        }

        var session = new Session(user.getId());
        cookieHelper.setCookie(session, request, response, (cookie) -> {
            if (data.isPersistent) {
                // Keep it for 10 years.
                cookie.setMaxAge(315_569_520);
            } else {
                // Session cookie - deleted when the browser is closed.
                cookie.setMaxAge(-1);
            }
        });
        return user;
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(HttpServletRequest request, HttpServletResponse response) {
        var cookie = cookieHelper.findCookie(request);
        var session = cookieHelper.parseSessionFromCookie(cookie);

        // Load the session user just to ensure that it exists.
        // If it does not, we respond with a 404.
        cookieHelper.findSessionUser(session);

        cookieHelper.setCookie(session, request, response, (newCookie) -> {
            newCookie.setMaxAge(0);
        });
    }

    public static final class LoginData {
        private String email;
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
