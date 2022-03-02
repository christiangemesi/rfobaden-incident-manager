package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelControllerTest;
import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.services.TransportService;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

@WebMvcTest(TransportController.class)
public class TransportControllerTest
    extends ModelControllerTest.Basic<Transport, TransportService> {

    @Override
    protected String getEndpointFor(EmptyPath emptyPath) {
        return "/api/v1/transports/";
    }

    @MockBean
    IncidentService incidentService;

    @Override
    protected void mockRelations(Transport transport, EmptyPath path) {
        var incident = transport.getIncident();
        if (incident != null) {
            Mockito.when(incidentService.find(incident.getId()))
                .thenReturn(Optional.of(incident));
        }
    }
}
