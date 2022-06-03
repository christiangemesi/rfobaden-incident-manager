package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.controllers.data.SessionData;
import ch.rfobaden.incidentmanager.backend.models.User;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;
import java.util.function.Supplier;

/**
 * {@code AuthService} defines methods to access the current authentication state.
 */
@Service("auth")
public class AuthService {
    private final Supplier<SecurityContext> securityContextSupplier;

    public AuthService(Supplier<SecurityContext> securityContextSupplier) {
        this.securityContextSupplier = securityContextSupplier;
    }

    /**
     * Attempts to load the current session.
     *
     * @return An {@link Optional} containing the current session,
     *         or {@link Optional#empty()}, if no session exists.
     */
    public Optional<SessionData> getSession() {
        var securityContext = securityContextSupplier.get();
        var auth = securityContext.getAuthentication();
        if (auth == null) {
            return Optional.empty();
        }
        var principal = auth.getPrincipal();
        if (!(principal instanceof SessionData)) {
            return Optional.empty();
        }
        return Optional.of((SessionData) principal);
    }

    /**
     * Attempts to load the current session user.
     *
     * @return An {@link Optional} containing the current user,
     *         or {@link Optional#empty()}, if no session exists.
     */
    public Optional<User> getCurrentUser() {
        return getSession().map(SessionData::getUser);
    }

    /**
     * Loads the current session user.
     *
     * @return The current session user.
     *
     * @throws IllegalStateException If no session exists.
     */
    public User requireCurrentUser() {
        return getCurrentUser().orElseThrow(() -> (
            new IllegalStateException("can't require current user, not authenticated")
        ));
    }

    /**
     * Checks if the current session user has a specific id.
     *
     * @param id The id to check for.
     * @return Whether the current session user's id matches the given id.
     */
    public boolean isCurrentUser(Long id) {
        return getCurrentUser().filter((user) -> Objects.equals(user.getId(), id)).isPresent();
    }
}
