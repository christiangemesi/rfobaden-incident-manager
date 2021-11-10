package ch.rfobaden.incidentmanager.backend.controllers.helpers;

import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Session;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import java.net.URI;
import java.util.function.Consumer;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class SessionCookieHelper {
    public static final String COOKIE_NAME = "rfobaden.incidentmanager.session.token";

    private final UserService userService;

    public SessionCookieHelper(UserService userService) {
        this.userService = userService;
    }

    public Cookie findCookie(HttpServletRequest request) {
        var cookie = WebUtils.getCookie(request, COOKIE_NAME);
        if (cookie == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "no active session");
        }
        return cookie;
    }

    public Session parseSessionFromCookie(Cookie cookie) {
        var token = cookie.getValue();
        var session = Session.decode(token).orElse(null);
        if (session == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "no active session");
        }
        return session;
    }

    public void setCookie(
        Session session,
        HttpServletRequest request,
        HttpServletResponse response,
        Consumer<Cookie> configure
    ) {
        var cookie = new Cookie(COOKIE_NAME, Session.encode(session));
        cookie.setHttpOnly(true);
        cookie.setDomain(parseServerDomainFromRequest(request));
        cookie.setPath("/api/v1/");
        cookie.setSecure(request.isSecure());
        configure.accept(cookie);
        response.addCookie(cookie);

        // Add 'SameSite=Lax' to the session cookie.
        // Spring does currently (2021.10.09) not support setting this attribute.
        var cookieHeader = response.getHeaders("Set-Cookie").stream().findFirst().orElseThrow();
        response.setHeader("Set-Cookie", cookieHeader + "; SameSite=Lax");
    }

    public User findSessionUser(Session session) {
        var user = userService.find(session.getUserId()).orElse(null);
        if (user == null || user.getCredentials().getUpdatedAt().isAfter(session.getCreatedAt())) {
            throw new ApiException(HttpStatus.NOT_FOUND, "no active session");
        }
        return user;
    }

    private static String parseServerDomainFromRequest(HttpServletRequest request) {
        var host = URI.create(request.getRequestURL().toString()).getHost();
        if (host.startsWith("www.")) {
            return host.substring(4);
        }
        return host;
    }
}
