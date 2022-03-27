package ch.rfobaden.incidentmanager.backend.services;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.repos.IncidentRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryServiceTest;
import ch.rfobaden.incidentmanager.backend.test.generators.CloseReasonGenerator;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.RepeatedTest;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

@SpringBootTest
public class IncidentServiceTest
    extends ModelRepositoryServiceTest.Basic<Incident, IncidentService, IncidentRepository> {
    @Autowired
    Faker faker;

    @Autowired
    CloseReasonGenerator closeReasonGenerator;

    @RepeatedTest(5)
    void testClose() {
        // Given
        var record = generator.generate();
        record.setCloseReason(null);
        record.setClosed(false);

        var message = faker.harryPotter().quote();

        Mockito.when(repository.findById(record.getId()))
            .thenReturn(Optional.of(record));

        Mockito.when(repository.findByPath(record.toPath(), record.getId()))
            .thenReturn(Optional.of(record));

        Mockito.when(repository.save(record))
            .thenReturn(record);

        // When
        var result = service.closeIncident(record.getId(), message);

        // Then
        assertThat(result)
            .isPresent();

        var incident = result.get();
        assertThat(incident.isClosed()).isTrue();
        assertThat(incident.getCloseReason()).isNotNull();
        assertThat(incident.getCloseReason().getMessage()).isEqualTo(message);
        assertThat(incident.getCloseReason().getPrevious()).isNull();
    }

    @RepeatedTest(5)
    void testClose_unknownIncident() {
        // Given
        var id = generator.generateId();
        var message = faker.harryPotter().quote();
        Mockito.when(repository.findById(id))
            .thenReturn(Optional.empty());

        // When
        var result = service.closeIncident(id, message);

        // Then
        assertThat(result).isEmpty();
    }

    @RepeatedTest(5)
    void testReopen() {
        // Given
        var record = generator.generate();
        var closeReason = closeReasonGenerator.generate();
        record.setCloseReason(closeReason);
        record.setClosed(true);

        Mockito.when(repository.findById(record.getId()))
            .thenReturn(Optional.of(record));

        Mockito.when(repository.findByPath(record.toPath(), record.getId()))
            .thenReturn(Optional.of(record));

        Mockito.when(repository.save(record))
            .thenReturn(record);

        // When
        var result = service.reopenIncident(record.getId());

        // Then
        assertThat(result)
            .isPresent();

        var incident = result.get();
        assertThat(incident.isClosed()).isFalse();
        assertThat(incident.getCloseReason()).isEqualTo(closeReason);
    }

    @RepeatedTest(5)
    void testReopen_unknownIncident() {
        // Given
        var id = generator.generateId();

        // When
        var result = service.reopenIncident(id);

        // Then
        assertThat(result).isEmpty();
    }
}
