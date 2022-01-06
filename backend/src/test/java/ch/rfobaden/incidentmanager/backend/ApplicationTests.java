package ch.rfobaden.incidentmanager.backend;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.function.Supplier;

@SpringBootTest
@Import(TestConfig.class)
class ApplicationTests {
    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    Supplier<SecurityContext> securityContextSupplier;

    @Test
    void testPasswordEncoder() {
        assertThat(passwordEncoder).isInstanceOf(BCryptPasswordEncoder.class);
    }

    @Test
    void testSecurityContextSupplier() {
        assertThat(securityContextSupplier.get()).isSameAs(SecurityContextHolder.getContext());
    }
}
