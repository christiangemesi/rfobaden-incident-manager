package ch.rfobaden.incidentmanager.backend.controllers;


import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller contains all the API mapping. This is part of the N-Tier pattern.
 */
@RestController
@RequestMapping(path = "api/v1/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    // This is Dependency injection
    @Autowired
    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping
    public List<Incident> getIncidents() {
        return incidentService.getIncidents();
    }

    @GetMapping("{incidentId}")
    public Incident getIncidentById(@PathVariable(value = "incidentId") Long incidentId) {
        return incidentService.getIncidentById(incidentId).orElseThrow(() -> (
                new ApiException(HttpStatus.NOT_FOUND, "incident not found")
        ));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Incident addNewIncident(@RequestBody Incident incident) {
        return incidentService.addNewIncident(incident);
    }

    @DeleteMapping(value = "{incidentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteIncidentById(
            @PathVariable(value = "incidentId") Long incidentId) {
        if (!incidentService.deleteIncidentById(incidentId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "incident not found");
        }
    }
}
