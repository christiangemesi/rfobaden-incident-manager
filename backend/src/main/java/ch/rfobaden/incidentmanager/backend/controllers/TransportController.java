package ch.rfobaden.incidentmanager.backend.controllers;


import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.services.TransportService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/v1/transports")
public class TransportController extends ModelController.Basic<Transport, TransportService> {

    private final IncidentService incidentService;

    public TransportController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @Override
    protected void loadRelations(Transport transport, EmptyPath path) {
        if (transport.getIncident() != null) {
            var incident = incidentService.find(transport.getIncident().getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "incident not found"));
            transport.setIncident(incident);
        }
    }



}
