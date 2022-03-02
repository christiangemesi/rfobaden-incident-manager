package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.repos.TransportRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryServiceTest;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

@SpringBootTest
public class TransportServiceTest
    extends ModelRepositoryServiceTest.Basic<Transport, TransportService, TransportRepository> {

    @MockBean
    IncidentService incidentService;

    @Override
    protected void mockRelations(Transport transport, EmptyPath path) {
        var address = transport.getIncident();
        if (address != null) {
            Mockito.when(incidentService.find(address.getId()))
                .thenReturn(Optional.of(address));
        }
    }

}
