package ch.rfobaden.incidentmanager.backend.repos;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;

import ch.rfobaden.incidentmanager.backend.models.Incident;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@DataJpaTest
public class IncidentRepositoryTest {

    @Autowired
    private IncidentRepository incidentRepository;

    @Test
    public void testRepositoryIsEmpty() {
        // When
        List<Incident> incidents = incidentRepository.findAll();

        // Then
        assertThat(incidents).isEmpty();
    }

    @Test
    public void testAddIncident() {
        // Given
        var title = "My Incident";
        var authorId = 42L;
        var description = "This is an awesome description";
        var closeReason = "Do i need a reason?";
        var isClosed = false;
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime updatedAt = LocalDateTime.now();
        LocalDateTime startsAt = LocalDateTime.now().minusDays(10);
        LocalDateTime endsAt = LocalDateTime.now().plusDays(10);

        // When
        var data = new Incident();
        data.setTitle(title);
        data.setAuthorId(authorId);
        data.setDescription(description);
        data.setCloseReason(closeReason);
        data.setClosed(isClosed);
        data.setCreatedAt(createdAt);
        data.setUpdatedAt(updatedAt);
        data.setStartsAt(startsAt);
        data.setEndsAt(endsAt);
        Incident incident = incidentRepository.save(data);

        // Then
        assertThat(incident.getId()).isGreaterThan(0);
        assertThat(incident.getTitle()).isEqualTo(title);
        assertThat(incident.getAuthorId()).isEqualTo(authorId);
        assertThat(incident.getDescription()).isEqualTo(description);
        assertThat(incident.getCloseReason()).isEqualTo(closeReason);
        assertThat(incident.isClosed()).isEqualTo(isClosed);
        assertThat(incident.getCreatedAt()).isEqualTo(createdAt);
        assertThat(incident.getUpdatedAt()).isEqualTo(updatedAt);
        assertThat(incident.getStartsAt()).isEqualTo(startsAt);
        assertThat(incident.getEndsAt()).isEqualTo(endsAt);
    }

    @Test
    public void testGetIncidents() {
        // Given
        Incident incident1 = incidentRepository.save(new Incident("Incident 1", 11L));
        Incident incident2 = incidentRepository.save(new Incident("Incident 2", 22L));
        Incident incident3 = incidentRepository.save(new Incident("Incident 3", 33L));

        // When
        List<Incident> incidents = incidentRepository.findAll();

        // Then
        assertThat(incidents).hasSize(3).contains(incident1, incident2, incident3);
    }

    @Test
    public void testGetIncidentById() {
        // Given
        incidentRepository.save(new Incident("Incident 1", 42L));
        Incident incident2 = incidentRepository.save(new Incident("Incident 2", 81L));

        // When
        Incident incident = incidentRepository.findById(incident2.getId()).orElse(null);

        // Then
        assertThat(incident).isNotNull();
        assertThat(incident).isEqualTo(incident2);
    }

    @Test
    public void testDeleteIncidentById() {
        // Given
        Incident incident1 = incidentRepository.save(new Incident("incident1", 11L));
        Incident incident2 = incidentRepository.save(new Incident("incident2", 22L));
        Incident incident3 = incidentRepository.save(new Incident("incident3", 33L));

        // When
        incidentRepository.deleteById(incident2.getId());

        // Then
        assertThat(incidentRepository.findAll()).hasSize(2).contains(incident1, incident3);
    }
}
