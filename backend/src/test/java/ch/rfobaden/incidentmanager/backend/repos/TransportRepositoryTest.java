package ch.rfobaden.incidentmanager.backend.repos;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.models.paths.TransportPath;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import ch.rfobaden.incidentmanager.backend.test.generators.UserGenerator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.ArrayList;

@DataJpaTest
public class TransportRepositoryTest
    extends ModelRepositoryTest<Transport, TransportPath, TransportRepository> {

    @Autowired
    IncidentRepository incidentRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    VehicleRepository vehicleRepository;

    @Autowired
    TrailerRepository trailerRepository;

    @Autowired
    UserGenerator userGenerator;

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

        var vehicle = transport.getVehicle();
        if (vehicle != null) {
            transport.setVehicle(vehicleRepository.save(vehicle));
        }

        var trailer = transport.getTrailer();
        if (trailer != null) {
            transport.setTrailer(trailerRepository.save(trailer));
        }
    }

    @Test
    void testFindByAssigneeId() {
        // Given
        var records = generator.generate(10);
        var assignedRecords = new ArrayList<Transport>();
        var assignee = userRepository.save(userGenerator.generate());

        for (var record : records) {
            record.setAssignee(null);
            if (generator.randomBoolean()) {
                record.setAssignee(assignee);
            }
            this.saveRelations(record);
            record = repository.save(record);
            if (record.getAssignee() != null) {
                assignedRecords.add(record);
            }
        }

        // When
        var result = repository.findAllByAssigneeId(assignee.getId());

        // Then
        assertThat(result.size()).isEqualTo(assignedRecords.size());
        assertThat(result).asList().containsExactlyInAnyOrderElementsOf(assignedRecords);
    }
}
