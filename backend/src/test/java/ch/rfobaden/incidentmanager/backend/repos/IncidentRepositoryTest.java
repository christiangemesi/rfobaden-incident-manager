package ch.rfobaden.incidentmanager.backend.repos;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;

import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.repos.IncidentRepository;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@DataJpaTest
public class IncidentRepositoryTest {

    @Autowired
    private IncidentRepository incidentRepository;

    @Test
    public void testRepositoryIsEmpty() {
        // Given
        // When
        List<Incident> incidents = incidentRepository.findAll();
        // Then
        assertThat(incidents).isEmpty();
    }

    @Test
    public void testAddIncident() {
        // Given
        Incident newIncident = new Incident(1, "incident1", 1,
                "This is an incident", LocalDate.now());
        // When
        Incident savedIncident = incidentRepository.save(newIncident);
        // Then
        assertThat(savedIncident.getId()).isGreaterThan(0);
        assertThat(savedIncident).hasFieldOrPropertyWithValue("title", "incident1");
        assertThat(savedIncident).hasFieldOrPropertyWithValue("description", "This is an incident");
        //todo test other fields or properties
    }

    @Disabled
    @Test
    public void testGetIncidents() {
        // Given
        Incident incident1 = new Incident(1, "incident1", 1,
                "This is an incident", LocalDate.now());
        Incident incident2 = new Incident(2, "incident2", 1,
                "This is an incident", LocalDate.now());
        Incident incident3 = new Incident(3, "incident3", 1,
                "This is an incident", LocalDate.now());
        incidentRepository.save(incident1);
        incidentRepository.save(incident2);
        incidentRepository.save(incident3);
        // When
        //todo why not work when run together?
        List<Incident> incidents = incidentRepository.findAll();
        // Then
        assertThat(incidents).hasSize(3).contains(incident1, incident2, incident3);
    }

    @Disabled
    @Test
    public void testGetIncidentById() {
        // Given
        incidentRepository.deleteAll();
        Incident incident1 = new Incident(1, "incident1", 1,
                "This is an incident", LocalDate.now());
        Incident incident2 = new Incident(2, "incident2", 1,
                "This is an incident", LocalDate.now());
        Long incidentId = 2L;
        incidentRepository.save(incident1);
        incidentRepository.save(incident2);
        // When
        Optional<Incident> foundIncident = incidentRepository.findById(incidentId);
        // Then
        assertTrue(foundIncident.isPresent());
        assertThat(foundIncident.get().getId()).isEqualTo(incidentId);
        assertThat(foundIncident.get()).hasFieldOrPropertyWithValue("title", "incident2");
        assertThat(foundIncident.get()).hasFieldOrPropertyWithValue("description", "This is an incident");
    }

    @Disabled
    @Test
    public void testDeleteIncidentById() {
        // Given
        incidentRepository.deleteAll();
        Incident incident1 = new Incident(1, "incident1", 1,
                "This is an incident", LocalDate.now());
        Incident incident2 = new Incident(2, "incident2", 1,
                "This is an incident", LocalDate.now());
        Incident incident3 = new Incident(3, "incident3", 1,
                "This is an incident", LocalDate.now());

        incidentRepository.save(incident1);
        incidentRepository.save(incident2);
        incidentRepository.save(incident3);

        List<Incident> incidents = incidentRepository.findAll();
        assertThat(incidents.size()).isEqualTo(3);

        Long incidentId = 2L;

        // When
        // TODO Why not workkkkk when run together
        incidentRepository.deleteById(incidentId);
        incidents = incidentRepository.findAll();
        // Then
        assertThat(incidents).hasSize(2).contains(incident1, incident3);
    }



}
