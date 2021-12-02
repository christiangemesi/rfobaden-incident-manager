package ch.rfobaden.incidentmanager.backend.services;


import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.repos.IncidentRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;


@Service
public class IncidentService extends ModelRepositoryService.Basic<Incident, IncidentRepository>{
    public Optional<Incident> closeIncident(Long incidentId, String closeReason) {
        Incident incident = find(incidentId).orElse(null);
        if (incident == null) {
            return Optional.empty();
        }
        incident.setClosedAt(LocalDateTime.now());
        incident.setCloseReason(closeReason);
        incident.setClosed(true);
        return update(EmptyPath.getInstance(), incident);
    }

    public Optional<Incident> reopenIncident(Long incidentId) {
        Incident incident = find(incidentId).orElse(null);
        if (incident == null) {
            return Optional.empty();
        }
        incident.setClosedAt(null);
        incident.setCloseReason(null);
        incident.setClosed(false);
        return update(EmptyPath.getInstance(), incident);
    }


}
