package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelControllerTest;
import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.models.paths.TransportPath;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.services.TransportService;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;

@WebMvcTest(TransportController.class)
public class TransportControllerTest
    extends ModelControllerTest<Transport, TransportPath, TransportService> {

    @Autowired
    protected UserService userService;

    @MockBean
    IncidentService incidentService;

    @Override
    protected String getEndpointFor(TransportPath path) {
        return "/api/v1/incidents/" + path.getIncidentId() + "/transport/";
    }

    @Override
    protected void mockRelations(TransportPath path, Transport transport) {
        Mockito.when(incidentService.find(path, path.getIncidentId()))
            .thenReturn(Optional.of(transport.getIncident()));
    }
}
