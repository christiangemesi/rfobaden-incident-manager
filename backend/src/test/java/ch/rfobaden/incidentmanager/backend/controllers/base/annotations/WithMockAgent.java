package ch.rfobaden.incidentmanager.backend.controllers.base.annotations;


import org.springframework.security.test.context.support.WithMockUser;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@WithMockUser(username = "Alice", password = "Agent", roles = "AGENT")
public @interface WithMockAgent {
}
