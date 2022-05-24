package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.CloseReason;
import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.repos.IncidentRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import ch.rfobaden.incidentmanager.backend.services.base.ModelService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * {@code IncidentService} is a {@link ModelService} for {@link Incident incidents}.
 */
@Service
public class IncidentService extends ModelRepositoryService.Basic<Incident, IncidentRepository> {
    /**
     * Closes an incident.
     *
     * @param incidentId The id of the incident that should be closed.
     * @param closeMessage The close message.
     * @return An {@link Optional} containing the closed incident,
     *         or {@link Optional#empty()}, if no matching incident exists.
     */
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

    /**
     * Reopens an incident.
     *
     * @param incidentId The id of the incident that should be reopened.
     * @return An {@link Optional} containing the reopened incident,
     *         or {@link Optional#empty()}, if no matching incident exists.
     */
    public Optional<Incident> reopenIncident(Long incidentId) {
        Incident incident = find(incidentId).orElse(null);
        if (incident == null) {
            return Optional.empty();
        }
        incident.setClosed(false);
        return update(EmptyPath.getInstance(), incident);
    }

    /**
     * Paginates all closed incidents.
     *
     * @param limit The maximum amount of entities to include per page.
     * @param offset The offset of pages.
     * @return The resulting {@link Page}.
     */
    public Page<Incident> listClosedIncidents(int limit, int offset) {
        return repository.findAllClosed(PageRequest.of(offset, limit));
    }
}
