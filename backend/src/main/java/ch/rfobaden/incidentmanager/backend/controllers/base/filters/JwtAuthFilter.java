package ch.rfobaden.incidentmanager.backend.controllers.base.filters;

import ch.rfobaden.incidentmanager.backend.WebSecurityConfig;
import ch.rfobaden.incidentmanager.backend.controllers.helpers.JwtHelper;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private static final String BEARER_HEADER_PREFIX = "Bearer ";

    private final JwtHelper jwtHelper;

    public JwtAuthFilter(JwtHelper jwtHelper) {
        this.jwtHelper = jwtHelper;
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain chain
    ) throws ServletException, IOException {
        var user = processRequest(request);
        if (user != null) {
            var details = new WebSecurityConfig.DetailsWrapper(user);
            var auth = new UsernamePasswordAuthenticationToken(user, null, details.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        chain.doFilter(request, response);
    }

    private User processRequest(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null || authHeader.isEmpty()) {
            return null;
        }
        if (!authHeader.startsWith(BEARER_HEADER_PREFIX)) {
            throw new ApiException(
                HttpStatus.BAD_REQUEST,
                "Authorization header must be a bearer token"
            );
        }
        var token = authHeader.substring(BEARER_HEADER_PREFIX.length());
        return jwtHelper.decodeUser(token).orElseThrow(() -> (
            new ApiException(HttpStatus.UNAUTHORIZED, "token expired")
        ));
    }
}
