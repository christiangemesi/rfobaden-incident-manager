package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.models.paths.TransportPath;
import ch.rfobaden.incidentmanager.backend.repos.TransportRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryServiceTest;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TransportServiceTest
    extends ModelRepositoryServiceTest<Transport, TransportPath, TransportService, TransportRepository> {

}
