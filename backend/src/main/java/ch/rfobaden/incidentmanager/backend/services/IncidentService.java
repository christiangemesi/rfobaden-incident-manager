package ch.rfobaden.incidentmanager.backend.services;


import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.repos.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service Layer is responsible for business logic. This is part of the N-Tier pattern.
 */
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

    public Incident addNewIncident(Incident incident) {
        return incidentRepository.save(incident);
    }

    public Optional<Incident> getIncidentByID(Long incidentId) {
        return incidentRepository.findById(incidentId);
    }

    public Optional<Incident> getIncidentByTitle(String title) {
        return incidentRepository.findOneByTitle(title);
    }

    public boolean deleteIncidentByID(Long incidentId) {
        if (incidentRepository.existsById(incidentId)) {
            incidentRepository.deleteById(incidentId);
            return true;
        }
        return false;
    }

}
