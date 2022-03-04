package ch.rfobaden.incidentmanager.backend.controllers;


import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.models.paths.TransportPath;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.services.TransportService;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping(path = "/api/v1/incidents/{incidentId}/transports")
public class TransportController
    extends ModelController<Transport, TransportPath, TransportService> {

    private final IncidentService incidentService;
    private final UserService userService;


    public TransportController(IncidentService incidentService, UserService userService) {
        this.incidentService = incidentService;
        this.userService = userService;
    }

    @Override
    protected void loadRelations(TransportPath path, Transport transport) {
        var incident = incidentService.find(path, path.getIncidentId())
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "incident not found"));
        transport.setIncident(incident);

        if (transport.getAssignee() != null) {
            var assignee = userService.find(transport.getAssignee().getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "assignee not found"));
            transport.setAssignee(assignee);
        }
    }
}
