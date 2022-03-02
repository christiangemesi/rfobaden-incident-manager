package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.repos.TransportRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class TransportService
    extends ModelRepositoryService.Basic<Transport, TransportRepository> {

    private final IncidentService incidentService;

    public TransportService(IncidentService incidentService) {
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
