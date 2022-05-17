package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelControllerTest;
import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.models.paths.TransportPath;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.services.TrailerService;
import ch.rfobaden.incidentmanager.backend.services.TransportService;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import ch.rfobaden.incidentmanager.backend.services.VehicleService;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

@WebMvcTest(TransportController.class)
public class TransportControllerTest
    extends ModelControllerTest<Transport, TransportPath, TransportService> {

    @Autowired
    protected UserService userService;

    @MockBean
    IncidentService incidentService;

    @MockBean
    VehicleService vehicleService;

    @MockBean
    TrailerService trailerService;

    @Override
    protected String getEndpointFor(TransportPath path) {
        return "/api/v1/incidents/" + path.getIncidentId() + "/transports/";
    }

    @Override
    protected void mockRelations(TransportPath path, Transport transport) {
        Mockito.when(incidentService.find(path, path.getIncidentId()))
            .thenReturn(Optional.of(transport.getIncident()));

        var assignee = transport.getAssignee();
        if (assignee != null) {
            Mockito.when(userService.find(assignee.getId()))
                .thenReturn(Optional.of(assignee));
        }

        var vehicle = transport.getVehicle();
        if (vehicle != null) {
            Mockito.when(vehicleService.find(vehicle.getId()))
                .thenReturn(Optional.of(vehicle));
        }

        var trailer = transport.getTrailer();
        if (trailer != null) {
            Mockito.when(trailerService.find(trailer.getId()))
                .thenReturn(Optional.of(trailer));
        }
    }
}
