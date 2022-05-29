package ch.rfobaden.incidentmanager.backend.controllers.base.filters;

import ch.rfobaden.incidentmanager.backend.controllers.data.SessionData;
import ch.rfobaden.incidentmanager.backend.controllers.helpers.JwtHelper;
import ch.rfobaden.incidentmanager.backend.controllers.helpers.SessionHelper;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * {@code JwtAuthFilter} is a {@link OncePerRequestFilter} that
 * parses the current session from requests.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private static final String BEARER_HEADER_PREFIX = "Bearer ";

    private final JwtHelper jwtHelper;
    private final SessionHelper sessionHelper;

    public JwtAuthFilter(JwtHelper jwtHelper, SessionHelper sessionHelper) {
        this.jwtHelper = jwtHelper;
        this.sessionHelper = sessionHelper;
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain chain
    ) throws ServletException, IOException {
        processRequest(request, response).ifPresent((session) -> {
            var auth = new UsernamePasswordAuthenticationToken(
                session,
                null,
                List.of(new SimpleGrantedAuthority("ROLE_" + session.getUser().getRole().name()))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
        });
        chain.doFilter(request, response);
    }

    /**
     * Attempts to parse a session from a http request.
     * <p>
     *     If an expired session token exists,
     *     it will be deleted from the response.
     * </p>
     *
     * @param request The http request.
     * @param response The http response.
     * @return The session token, if it exists.
     */
    private Optional<SessionData> processRequest(
        HttpServletRequest request,
        HttpServletResponse response
    ) {
        return getTokenFromHeader(request)
            .or(() -> getTokenFromCookie(request))
            .map((token) -> {
                var user = jwtHelper.decodeUser(token).orElseThrow(() -> {
                    sessionHelper.deleteSessionFromResponse(response);
                    return new ApiException(HttpStatus.UNAUTHORIZED, "token expired");
                });
                return new SessionData(user, token);
            });
    }

    /**
     * Attempts to parse the session token from the request
     * by checking if an Authorization header exists.
     *
     * @param request The http request.
     * @return The session token, if it exists.
     */
    private Optional<String> getTokenFromHeader(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null || authHeader.isEmpty()) {
            return Optional.empty();
        }
        if (!authHeader.startsWith(BEARER_HEADER_PREFIX)) {
            throw new ApiException(
                HttpStatus.BAD_REQUEST,
                "Authorization header must be a bearer token"
            );
        }
        return Optional.of(authHeader.substring(BEARER_HEADER_PREFIX.length()));
    }

    /**
     * Attempts to parse the session token from the request
     * by checking if a session cookie exists.
     *
     * @param request The http request.
     * @return The session token, if it exists.
     */
    private Optional<String> getTokenFromCookie(HttpServletRequest request) {
        var cookies = request.getCookies();
        if (cookies == null) {
            return Optional.empty();
        }
        return Arrays.stream(cookies)
            .filter((cookie) -> Objects.equals(cookie.getName(), SessionHelper.COOKIE_NAME))
            .map(Cookie::getValue)
            .findAny();
    }
}
