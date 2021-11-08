package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Session;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import ch.rfobaden.incidentmanager.backend.services.encryption.BcryptEncryptionService;
import ch.rfobaden.incidentmanager.backend.services.encryption.EncryptionService;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.Arrays;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping(path = "api/v1/session")
public final class SessionController {
    public static final String COOKIE_NAME = "rfobaden.incidentmanager.session.token";

    private final UserService userService;

    private final EncryptionService encryptionService;

    @Autowired
    public SessionController(
        UserService userService,
        BcryptEncryptionService encryptionService
    ) {
        this.userService = userService;
        this.encryptionService = encryptionService;
    }

    @GetMapping
    public User find(HttpServletRequest request) {
        var cookie = findCookie(request);
        var session = parseSessionFromCookie(cookie);
        return findSessionUser(session);
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
        var cookie = new Cookie(COOKIE_NAME, Session.encode(session));
        setCookie(cookie, request, response, () -> {
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
        var cookie = findCookie(request);

        var session = parseSessionFromCookie(cookie);

        // Load the session user just to ensure that it exists.
        // If it does not, we respond with a 404.
        findSessionUser(session);

        setCookie(cookie, request, response, () -> {
            cookie.setMaxAge(0);
        });
    }

    private User findSessionUser(Session session) {
        var user = userService.find(session.getUserId()).orElse(null);
        if (user == null || user.getCredentials().getUpdatedAt().isAfter(session.getCreatedAt())) {
            throw new ApiException(HttpStatus.NOT_FOUND, "no active session");
        }
        return user;
    }

    private static Cookie findCookie(HttpServletRequest request) {
        var cookies = request.getCookies();
        if (cookies == null) {
            cookies = new Cookie[0];
        }
        return Arrays.stream(cookies)
            .filter((it) -> it.getName().equals(COOKIE_NAME))
            .findFirst()
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "no active session"));
    }

    private static void setCookie(
        Cookie cookie,
        HttpServletRequest request,
        HttpServletResponse response,
        Runnable configure
    ) {
        cookie.setHttpOnly(true);
        cookie.setDomain(parseDomainFromRequest(request));
        cookie.setPath("/api/v1/");
        cookie.setSecure(request.isSecure());
        configure.run();
        response.addCookie(cookie);

        // Add 'SameSite=Lax' to the session cookie.
        // Spring does currently (2021.10.09) not support setting this attribute.
        var cookieHeader = response.getHeaders("Set-Cookie").stream().findFirst().orElseThrow();
        response.setHeader("Set-Cookie", cookieHeader + "; SameSite=Lax");
    }

    private static Session parseSessionFromCookie(Cookie cookie) {
        var token = cookie.getValue();
        var session = Session.decode(token).orElse(null);
        if (session == null) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "invalid session token");
        }
        return session;
    }

    private static String parseDomainFromRequest(HttpServletRequest request) {
        var host = URI.create(request.getRequestURL().toString()).getHost();
        if (host.startsWith("www.")) {
            return host.substring(4);
        }
        return host;
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
