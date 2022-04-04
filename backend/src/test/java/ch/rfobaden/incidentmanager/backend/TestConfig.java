package ch.rfobaden.incidentmanager.backend;


import ch.rfobaden.incidentmanager.backend.test.generators.CloseReasonGenerator;
import ch.rfobaden.incidentmanager.backend.test.generators.IncidentGenerator;
import ch.rfobaden.incidentmanager.backend.test.generators.OrganizationGenerator;
import ch.rfobaden.incidentmanager.backend.test.generators.ReportGenerator;
import ch.rfobaden.incidentmanager.backend.test.generators.SubtaskGenerator;
import ch.rfobaden.incidentmanager.backend.test.generators.TaskGenerator;
import ch.rfobaden.incidentmanager.backend.test.generators.TransportGenerator;
import ch.rfobaden.incidentmanager.backend.test.generators.UserCredentialsGenerator;
import ch.rfobaden.incidentmanager.backend.test.generators.UserGenerator;
import com.github.javafaker.Faker;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

import java.util.Locale;

@TestConfiguration
@Import({
    Application.class,
    UserGenerator.class,
    UserCredentialsGenerator.class,
    IncidentGenerator.class,
    ReportGenerator.class,
    TaskGenerator.class,
    TransportGenerator.class,
    SubtaskGenerator.class,
    OrganizationGenerator.class,
    CloseReasonGenerator.class,
})
public class TestConfig {
    @Bean
    public Faker createFaker() {
        return new Faker(new Locale("de-CH"));
    }
}
