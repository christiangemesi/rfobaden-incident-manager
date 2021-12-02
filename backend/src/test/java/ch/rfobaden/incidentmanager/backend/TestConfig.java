package ch.rfobaden.incidentmanager.backend;

import java.util.Locale;

import ch.rfobaden.incidentmanager.backend.test.generators.IncidentGenerator;
import ch.rfobaden.incidentmanager.backend.test.generators.UserCredentialsGenerator;
import ch.rfobaden.incidentmanager.backend.test.generators.UserGenerator;
import com.github.javafaker.Faker;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

@TestConfiguration
@Import({
    Application.class,
    UserGenerator.class,
    UserCredentialsGenerator.class,
    IncidentGenerator.class
})
public class TestConfig {
    @Bean
    public Faker createFaker() {
        return new Faker(new Locale("de-CH"));
    }
}
