package ch.rfobaden.incidentmanager.backend.controllers;


import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.RequireAgent;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.models.paths.ReportPath;
import ch.rfobaden.incidentmanager.backend.models.paths.TransportPath;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.services.TransportService;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
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
    @RequireAgent
    public Transport create(@ModelAttribute TransportPath path, @RequestBody Transport entity) {
        return super.create(path, entity);
    }

    @Override
    @RequireAgent
    public Transport update(
        @ModelAttribute TransportPath path,
        @PathVariable("id") Long id,
        @RequestBody Transport entity
    ) {
        return super.update(path, id, entity);
    }

    @Override
    @RequireAgent
    public void delete(@ModelAttribute TransportPath path, @PathVariable("id") Long id) {
        super.delete(path, id);
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
