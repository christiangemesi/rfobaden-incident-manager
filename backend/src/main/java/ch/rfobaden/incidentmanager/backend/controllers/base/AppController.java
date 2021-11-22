package ch.rfobaden.incidentmanager.backend.controllers.base;

import ch.rfobaden.incidentmanager.backend.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;

import java.util.Optional;
import java.util.function.Supplier;

public abstract class AppController {
    @Autowired
    Supplier<SecurityContext> securityContextSupplier;

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
