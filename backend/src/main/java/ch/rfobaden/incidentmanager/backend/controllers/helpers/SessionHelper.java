package ch.rfobaden.incidentmanager.backend.controllers.helpers;

import ch.rfobaden.incidentmanager.backend.RfoConfig;
import ch.rfobaden.incidentmanager.backend.controllers.data.SessionData;
import ch.rfobaden.incidentmanager.backend.models.User;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletResponse;

@Component
public class SessionHelper {
    public static final String COOKIE_NAME = "rfobaden.incidentmanager.session.token";

    private final RfoConfig rfoConfig;

    private final JwtHelper jwtHelper;

    public SessionHelper(RfoConfig rfoConfig, JwtHelper jwtHelper) {
        this.rfoConfig = rfoConfig;
        this.jwtHelper = jwtHelper;
    }

    public SessionData addSessionToResponse(HttpServletResponse response, User user) {
        var token = jwtHelper.encodeUser(user);
        response.addHeader(
            HttpHeaders.SET_COOKIE,
            buildCookie(token)
                .maxAge(jwtHelper.getTokenDuration())
                .build()
                .toString()
        );
        return new SessionData(user, token);
    }

    public void deleteSessionFromResponse(HttpServletResponse response) {
        response.addHeader(HttpHeaders.SET_COOKIE, buildCookie("").maxAge(0).build().toString());
    }

    private ResponseCookie.ResponseCookieBuilder buildCookie(String value) {
        return ResponseCookie.from(COOKIE_NAME, value)
            .httpOnly(true)
            .path("/")
            .sameSite("Strict")
            .secure(!rfoConfig.getStage().equals("development"));
    }
}
