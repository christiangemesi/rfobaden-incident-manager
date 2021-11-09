package ch.rfobaden.incidentmanager.backend.services;


import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.repos.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;

    @Autowired
    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public List<Incident> getIncidents() {
        return incidentRepository.findAll();
    }

    public Optional<Incident> getIncidentById(Long incidentId) {
        return incidentRepository.findById(incidentId);
    }

    public Incident addNewIncident(Incident incident) {
        incident.setCreatedAt(LocalDateTime.now());
        incident.setUpdatedAt(LocalDateTime.now());
        return incidentRepository.save(incident);
    }

    public Optional<Incident> updateIncident(Long incidentId, Incident incident) {
        Incident incidentOfId = getIncidentById(incidentId).orElse(null);
        if (incidentOfId == null) {
            return Optional.empty();
        }
        if (incident.getId() != incidentId) {
            throw new IllegalArgumentException("body id differs from parameter id");
        }
        incident.setUpdatedAt(LocalDateTime.now());
        return Optional.of(incidentRepository.save(incident));
    }

    public Optional<Incident> closeIncident(Long incidentId, String closeReason) {
        Incident incident = getIncidentById(incidentId).orElse(null);
        if (incident == null) {
            return Optional.empty();
        }
        incident.setClosedAt(LocalDateTime.now());
        incident.setCloseReason(closeReason);
        incident.setClosed(true);
        return updateIncident(incidentId, incident);
    }

    public Optional<Incident> reopenIncident(Long incidentId) {
        Incident incident = getIncidentById(incidentId).orElse(null);
        if (incident == null) {
            return Optional.empty();
        }
        incident.setClosedAt(null);
        incident.setCloseReason(null);
        incident.setClosed(false);
        return updateIncident(incidentId, incident);
    }

    public boolean deleteIncidentById(Long incidentId) {
        if (incidentRepository.existsById(incidentId)) {
            incidentRepository.deleteById(incidentId);
            return true;
        }
        return false;
    }

}
