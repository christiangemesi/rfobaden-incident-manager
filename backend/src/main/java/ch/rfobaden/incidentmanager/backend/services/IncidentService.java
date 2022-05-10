package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.CloseReason;
import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.repos.IncidentRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;


@Service
public class IncidentService extends ModelRepositoryService.Basic<Incident, IncidentRepository> {
    public Optional<Incident> closeIncident(Long incidentId, String closeMessage) {
        Incident incident = find(incidentId).orElse(null);
        if (incident == null) {
            return Optional.empty();
        }
        CloseReason closeReason = new CloseReason();
        closeReason.setCreatedAt(LocalDateTime.now());
        closeReason.setMessage(closeMessage);
        closeReason.setPrevious(incident.getCloseReason());
        incident.setCloseReason(closeReason);
        incident.setClosed(true);
        return update(EmptyPath.getInstance(), incident);
    }

    public Optional<Incident> reopenIncident(Long incidentId) {
        Incident incident = find(incidentId).orElse(null);
        if (incident == null) {
            return Optional.empty();
        }
        incident.setClosed(false);
        return update(EmptyPath.getInstance(), incident);
    }

    public Page<Incident> listClosedIncident(int limit, int offset) {
        return repository.findAllClosed(PageRequest.of(offset, limit));
    }
}
