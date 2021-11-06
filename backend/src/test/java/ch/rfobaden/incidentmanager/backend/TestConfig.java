package ch.rfobaden.incidentmanager.backend;

import com.github.javafaker.Faker;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import java.util.Locale;

@TestConfiguration
public class TestConfig {
    @Bean
    public Faker createFaker() {
        return new Faker(new Locale("de-CH"));
    }
}
