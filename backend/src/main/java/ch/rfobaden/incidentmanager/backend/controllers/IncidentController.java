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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
    public Incident getIncidentById(@PathVariable("incidentId") Long incidentId) {
        return incidentService.getIncidentById(incidentId).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "incident not found")
        ));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Incident addNewIncident(@RequestBody Incident incident) {
        return incidentService.addNewIncident(incident);
    }

    @PutMapping("{incidentId}")
    @ResponseStatus(HttpStatus.OK)
    public Incident updateIncident(
        @PathVariable("incidentId") Long incidentId,
        @RequestBody Incident incident
    ) {
        return incidentService.updateIncident(incidentId, incident)
            .orElseThrow(() -> (
                new ApiException(HttpStatus.NOT_FOUND, "incident not found")
            ));
    }

    @PutMapping("{incidentId}/close")
    @ResponseStatus(HttpStatus.OK)
    public Incident closeIncident(
        @PathVariable("incidentId") Long incidentId,
        @RequestBody CloseIncidentData closeData
    ) {
        return incidentService.closeIncident(incidentId, closeData.getCloseReason())
            .orElseThrow(() -> (
                new ApiException(HttpStatus.NOT_FOUND, "incident not found")
            ));
    }

    @DeleteMapping("{incidentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteIncidentById(@PathVariable("incidentId") Long incidentId) {
        if (!incidentService.deleteIncidentById(incidentId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "incident not found");
        }
    }

    static class CloseIncidentData {
        private String closeReason;

        public String getCloseReason() {
            return closeReason;
        }

        public void setCloseReason(String closeReason) {
            this.closeReason = closeReason;
        }
    }
}
