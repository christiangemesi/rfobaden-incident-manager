package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.repos.IncidentRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryServiceTest;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class IncidentServiceTest
    extends ModelRepositoryServiceTest.Basic<Incident, IncidentService, IncidentRepository> {
    // TODO Test close and reopen, including with invalid id
}
