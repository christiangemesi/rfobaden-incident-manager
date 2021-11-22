package ch.rfobaden.incidentmanager.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.function.Supplier;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    /**
     * The {@link PasswordEncoder} used for authentication & authorization.
     */
    @Bean
    public PasswordEncoder getPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Makes the global {@link SecurityContext} available as bean.
     * <p>
     *     The context is also available by static method,
     *     but using the bean make code much easier to test.
     * </p>
     * <p>
     *     The context is not directly injected, but instead available by
     *     calling the injected {@code Supplier}. This is necessary since each
     *     request has it's own context, which it has to load itself.
     * </p>
     */
    @Bean
    public Supplier<SecurityContext> getSecurityContextSupplier() {
        return SecurityContextHolder::getContext;
    }
}
