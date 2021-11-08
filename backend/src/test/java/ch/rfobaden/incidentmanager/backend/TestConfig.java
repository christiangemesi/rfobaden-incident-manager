package ch.rfobaden.incidentmanager.backend;

import ch.rfobaden.incidentmanager.backend.test.generators.SessionGenerator;
import ch.rfobaden.incidentmanager.backend.test.generators.UserCredentialsGenerator;
import ch.rfobaden.incidentmanager.backend.test.generators.UserGenerator;
import com.github.javafaker.Faker;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

import java.util.Locale;

@TestConfiguration
@Import({
    UserGenerator.class,
    UserCredentialsGenerator.class,
    SessionGenerator.class,
})
public class TestConfig {
    @Bean
    public Faker createFaker() {
        return new Faker(new Locale("de-CH"));
    }
}
