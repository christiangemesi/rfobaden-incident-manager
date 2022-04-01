package ch.rfobaden.incidentmanager.backend.controllers.base.annotations;


import org.springframework.security.access.prepost.PreAuthorize;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * {@code RequireAdmin} requires a user with ADMIN permissions
 * to be logged in before a controller method can be accessed.
 * <p>
 *     Applying this annotation to an entire class will have the same effect
 *     as applying it to every controller method in that class.
 * </p>
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@PreAuthorize("hasRole('ADMIN')")
public @interface RequireAdmin {
}
