package ch.rfobaden.incidentmanager.backend.services;


import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.repos.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
        incident.setCreatedAt(LocalDate.now());
        incident.setUpdatedAt(LocalDate.now());
        return incidentRepository.save(incident);
    }

    public Incident updateIncident(Long incidentId, Incident incident) {
        if (incident.getId() != incidentId) {
            throw new IllegalArgumentException("body id differs from parameter id");
        }
        incident.setUpdatedAt(LocalDate.now());
        return incidentRepository.save(incident);
    }

    public Optional<Incident> closeIncident(Long incidentId, String closeReason) {
        Incident incident = getIncidentById(incidentId).orElse(null);
        if (incident == null) {
            return Optional.empty();
        }
        incident.setClosedAt(LocalDate.now());
        incident.setCloseReason(closeReason);
        incident.setClosed(true);
        return Optional.of(updateIncident(incidentId, incident));
    }

    public boolean deleteIncidentById(Long incidentId) {
        if (incidentRepository.existsById(incidentId)) {
            incidentRepository.deleteById(incidentId);
            return true;
        }
        return false;
    }

}
