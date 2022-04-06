package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.models.paths.TransportPath;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

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

}
