package ch.rfobaden.incidentmanager.backend.services;


import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.repos.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Incident addNewIncident(Incident incident) {
        return incidentRepository.save(incident);
    }

    public Incident closeIncident(Incident incident) {
        return incidentRepository.save(incident);
    }

    public Optional<Incident> getIncidentById(Long incidentId) {
        return incidentRepository.findById(incidentId);
    }

    public boolean deleteIncidentById(Long incidentId) {
        if (incidentRepository.existsById(incidentId)) {
            incidentRepository.deleteById(incidentId);
            return true;
        }
        return false;
    }

}
