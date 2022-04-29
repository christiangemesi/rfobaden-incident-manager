package ch.rfobaden.incidentmanager.backend.repos;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.WithMockAgent;
import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.paths.TransportPath;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.stream.Collectors;

@DataJpaTest
public class TransportRepositoryTest
    extends ModelRepositoryTest<Transport, TransportPath, TransportRepository> {

    @Autowired
    IncidentRepository incidentRepository;

    @Autowired
    UserRepository userRepository;

    @Override
    protected void saveRelations(Transport transport) {
        var incident = transport.getIncident();
        if (incident != null) {
            transport.setIncident(incidentRepository.save(incident));
        }

        var assignee = transport.getAssignee();
        if (assignee != null) {
            transport.setAssignee(userRepository.save(assignee));
        }
    }

    @Test
    @WithMockAgent
    void testListWhereAssigneeId() {
        // Given
        var amount = 10;
        var records = generator.generate(amount);
        User user = null;
        records.forEach(this::saveRelations);
        for (int i = 0; user == null && i < Math.random() * (amount - 1) + 1; i++) {
            user = records.get(i).getAssignee();
        }
        var assignee = user;

        records = repository.saveAll(records);
        var assignedRecords = records.stream()
            .filter(e -> e.getAssignee() == assignee && !e.getIncident().isClosed())
            .collect(Collectors.toList());

        // When
        assert user != null;
        var result = repository.listWhereAssigneeId(user.getId());

        // Then
        assertThat(result.size()).isEqualTo(assignedRecords.size());
        for (Transport transport : result) {
            assertThat(transport).isIn(assignedRecords);
        }
        for (Transport transport : assignedRecords) {
            assertThat(transport).isIn(result);
        }
    }
}
