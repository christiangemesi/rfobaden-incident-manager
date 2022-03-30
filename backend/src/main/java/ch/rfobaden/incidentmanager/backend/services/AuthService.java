package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.User;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;
import java.util.function.Supplier;

@Service("auth")
public class AuthService {
    private final Supplier<SecurityContext> securityContextSupplier;

    public AuthService(Supplier<SecurityContext> securityContextSupplier) {
        this.securityContextSupplier = securityContextSupplier;
    }

    public boolean isCurrentUser(Long id) {
        return getCurrentUser().filter((user) -> Objects.equals(user.getId(), id)).isPresent();
    }

    public Optional<User> getCurrentUser() {
        var securityContext = securityContextSupplier.get();
        var auth = securityContext.getAuthentication();
        if (auth == null) {
            return Optional.empty();
        }
        var principal = auth.getPrincipal();
        if (!(principal instanceof User)) {
            return Optional.empty();
        }
        return Optional.of((User) principal);
    }

    public User requireCurrentUser() {
        return getCurrentUser().orElseThrow(() -> (
            new IllegalStateException("can't require current user, not authenticated")
        ));
    }
}
